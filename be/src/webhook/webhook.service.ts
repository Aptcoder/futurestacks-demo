import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getPaymentParts } from 'src/common/helper/utils';
import { PaystackService } from 'src/common/paystack/service';
import {
  Delivery,
  DeliveryStatus,
  RiderPaymentMethod,
} from 'src/delivery/delivery.schema';
import {
  Transaction,
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from 'src/transaction/transaction.schema';
import { TransactionService } from 'src/transaction/transaction.service';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
// import { CreateWalletDto } from './dto/create-wallet.dto';
// import { UpdateWalletDto } from './dto/update-wallet.dto';

@Injectable()
export class WebhookService {
  constructor(
    @InjectModel(Delivery.name) private deliveryModel: Model<Delivery>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private userService: UserService,
    private transactionService: TransactionService,
    private paystackService: PaystackService,
  ) {}
  //   create(createWalletDto: CreateWalletDto) {
  //     return 'This action adds a new wallet';
  //   }

  async handleChargeSuccess(body: any) {
    const data = body.data;
    const metaData = data.metadata;
    if (metaData && metaData.type === 'wallet_funding') {
      const user = await this.userModel.findOne({
        email: data.customer.email,
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const existingTransaction =
        await this.transactionService.findWithReference(data.reference);
      if (existingTransaction) {
        throw new ConflictException('Transaction recorded');
      }

      await this.userService.creditUserAccount(user.id, data.amount);
      await this.transactionService.create(user.id, {
        balanceBefore: user.balance,
        balanceAfter: user.balance + data.amount,
        type: TransactionType.CREDIT,
        amount: data.amount,
        reference: data.reference,
        status: TransactionStatus.COMPLETED,
        category: TransactionCategory.FUND_WALLET,
      });

      return 'All done!';
    } else {
      const delivery = await this.deliveryModel
        .findOne({
          paymentReference: data.reference,
        })
        .populate('rider')
        .populate('user');

      if (!delivery) {
        throw new NotFoundException('Delivery not found');
      }

      if (delivery.status === DeliveryStatus.CLOSED) {
        return 'Thanks';
      }
      const riderAmount = getPaymentParts(delivery.price).rider;
      if (delivery.riderPaymentMethod === RiderPaymentMethod.WALLET) {
        await this.userService.creditUserAccount(
          delivery.rider.id,
          riderAmount,
        );
        await this.transactionService.create(delivery.user.id, {
          balanceBefore: delivery.user.balance,
          balanceAfter: delivery.user.balance,
          amount: delivery.price,
          type: TransactionType.DEBIT,
          reference: data.reference,
          status: TransactionStatus.COMPLETED,
          category: TransactionCategory.USER_DELIVERY_PAYMENT,
        });

        await this.transactionService.create(delivery.rider.id, {
          balanceBefore: delivery.rider.balance,
          balanceAfter: delivery.rider.balance + riderAmount,
          type: TransactionType.CREDIT,
          reference: data.reference,
          amount: riderAmount,
          status: TransactionStatus.COMPLETED,
          category: TransactionCategory.RIDER_DELIVERY_PAYMENT,
        });
      } else {
        await this.transactionService.create(delivery.user.id, {
          balanceBefore: delivery.user.balance,
          balanceAfter: delivery.user.balance,
          type: TransactionType.DEBIT,
          amount: delivery.price,
          reference: data.reference,
          status: TransactionStatus.COMPLETED,
          category: TransactionCategory.USER_DELIVERY_PAYMENT,
        });

        await this.transactionService.create(delivery.rider.id, {
          balanceBefore: delivery.rider.balance,
          balanceAfter: delivery.rider.balance,
          type: TransactionType.CREDIT,
          reference: data.reference,
          amount: riderAmount,
          status: TransactionStatus.COMPLETED,
          category: TransactionCategory.RIDER_DELIVERY_PAYMENT,
        });
      }

      await this.deliveryModel.updateOne(
        {
          _id: delivery.id,
        },
        {
          status: DeliveryStatus.CLOSED,
        },
      );

      return 'All done!';
    }
  }

  async handleTransferSuccess(body) {
    const data = body.data;
    const transaction = await this.transactionService.findWithReference(
      data.reference,
    );
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.status === TransactionStatus.COMPLETED) {
      return 'Transaction previously seen';
    }

    await this.transactionModel.updateOne(
      {
        _id: transaction.id,
      },
      {
        status: TransactionStatus.COMPLETED,
      },
    );
  }

  handlePaystack(data: any) {
    const event = data.event;
    switch (event) {
      case 'charge.success':
        return this.handleChargeSuccess(data);
      case 'transfer.success':
        return this.handleChargeSuccess(data);
      default:
        return 'All done';
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  //   update(id: number, updateWalletDto: UpdateWalletDto) {
  //     return `This action updates a #${id} wallet`;
  //   }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
