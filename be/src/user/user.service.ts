import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtHelper } from 'src/common/helper/jwt.helper';
import { AddSubaccountDto } from './dto/add-subaccount.dto';
import { PaystackService } from 'src/common/paystack/service';
import { generatePaystackReference } from 'src/common/helper/utils';
import {
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from 'src/transaction/transaction.schema';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private paystackService: PaystackService,
    private transactionService: TransactionService,
  ) {}
  async login(input: LoginUserDto) {
    const user = await this.userModel
      .findOne({
        email: input.email.toLowerCase(),
      })
      .select('+password');

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!bcrypt.compareSync(input.password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    const jwt = await JwtHelper.signToken({
      id: user.id,
      role: user.role,
    });
    const userObject = user.toObject();
    delete userObject.password;
    return {
      token: jwt,
      user: userObject,
    };
  }

  async create(createUserDto: CreateUserDto) {
    createUserDto.email = createUserDto.email.toLowerCase();
    const foundUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (foundUser) {
      throw new ConflictException(
        'User with this email address already exists',
      );
    }

    createUserDto.password = bcrypt.hashSync(createUserDto.password, 8);
    return this.userModel.create({ ...createUserDto });
  }

  async createWithdrawalAccount(
    userId: string,
    addSubaccountDto: AddSubaccountDto,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const subaccountResponse = await this.paystackService.createSubaccount({
      bankCode: addSubaccountDto.bankCode,
      accountNumber: addSubaccountDto.accountNumber,
      businessName: `User-${user.firstName}-${user.lastName}`,
    });

    if (!subaccountResponse.success) {
      throw new InternalServerErrorException('Unxpected error');
    }

    const recipientResponse = await this.paystackService.createRecipient({
      bankCode: addSubaccountDto.bankCode,
      accountNumber: addSubaccountDto.accountNumber,
      name: addSubaccountDto.accountName,
    });

    if (!recipientResponse.success) {
      throw new InternalServerErrorException('Unxpected error');
    }

    const updated = await this.userModel.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        subaccountCode: subaccountResponse.subaccountCode,
        recipientCode: recipientResponse.recipientCode,
        withdrawalAccount: {
          accountName: recipientResponse.accountName,
          bankCode: addSubaccountDto.bankCode,
          bankName: recipientResponse.bankName,
          accountNumber: recipientResponse.accountNumber,
        },
      },
      {
        new: true,
      },
    );

    return updated;
  }

  async withdawFromAccount(userId: string, amount: number) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (amount > user.balance) {
      throw new ConflictException('Insufficient balance');
    }

    if (!user.recipientCode) {
      throw new BadRequestException(
        'Create a withdrawal account before attempting to withdraw',
      );
    }

    const reference = generatePaystackReference();
    // const response = await this.paystackService.transfer({
    //   recipient_code: user.recipientCode,
    //   amount,
    //   reference,
    // });

    // if (!response.success) {
    //   throw new InternalServerErrorException('Unexpected error');
    // }

    await this.debitUserAccount(user.id, amount);
    await this.transactionService.create(user.id, {
      balanceBefore: user.balance,
      balanceAfter: user.balance - amount,
      type: TransactionType.DEBIT,
      amount: amount,
      reference: reference,
      status: TransactionStatus.COMPLETED,
      category: TransactionCategory.WITHDRAWAL,
    });
  }

  async fundUserAccount(userId: string, amount: number) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const response = await this.paystackService.createTransaction({
      email: user.email,
      amount,
      reference: generatePaystackReference(),
      metaData: JSON.stringify({
        type: 'wallet_funding',
      }),
    });

    if (!response.success) {
      throw new InternalServerErrorException(
        'Unexpected error creating transaction ',
      );
    }

    return response;
  }

  findAll() {
    return this.userModel.find();
  }

  async findSelf(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async creditUserAccount(userId: string, amount: number) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $inc: {
          balance: amount,
        },
      },
      {
        new: true,
      },
    );

    return user;
  }

  async debitUserAccount(userId: string, amount: number) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $inc: {
          balance: -amount,
        },
      },
      {
        new: true,
      },
    );

    return user;
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
