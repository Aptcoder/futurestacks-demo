import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import {
  Delivery,
  DeliveryStatus,
  RiderPaymentMethod,
} from './delivery.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaystackService } from 'src/common/paystack/service';
import {
  generatePaystackReference,
  getPaymentParts,
} from 'src/common/helper/utils';
import { User } from 'src/user/user.schema';
import { TransactionService } from 'src/transaction/transaction.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(Delivery.name) private deliveryModel: Model<Delivery>,
    @InjectModel(User.name) private userModel: Model<User>,
    private paystackService: PaystackService,
    private transactionService: TransactionService,
    private userService: UserService,
  ) {}
  async create(userId: string, createDeliveryDto: CreateDeliveryDto) {
    const delivery = await this.deliveryModel.create({
      user: userId,
      ...createDeliveryDto,
    });
    return delivery;
  }

  async verifyDeliveryPayment(userId: string, reference: string) {
    const delivery = await this.deliveryModel
      .findOne({
        paymentReference: reference,
        user: userId,
      })
      .populate('user')
      .populate('rider');

    if (!delivery) {
      throw new NotFoundException('Delivery with reference not found');
    }

    if (delivery.status === DeliveryStatus.CLOSED) {
      return delivery;
    }

    // else if(delivery.status === DeliveryStatus.OPEN){}

    const result = await this.paystackService.verifyTransactions({ reference });
    if (!result.success) {
      throw new BadRequestException('Not a verified transaxtion');
    }
    return delivery;
  }

  async createDeliveryPayment(userId: string, deliveryId: string) {
    const delivery = await this.deliveryModel
      .findOne({
        user: userId,
        _id: deliveryId,
      })
      .populate('user')
      .populate('rider');
    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    if (delivery.paymentUrl) {
      return delivery;
    }

    const reference = generatePaystackReference();
    const transactionObject = {
      email: delivery.user.email,
      amount: delivery.price,
      reference,
    };

    if (delivery.riderPaymentMethod === RiderPaymentMethod.DISBURSE) {
      Object.assign(transactionObject, {
        transactionCharge: getPaymentParts(delivery.price).system,
        subaccount: delivery.rider.subaccountCode,
      });
    }

    const response =
      await this.paystackService.createTransaction(transactionObject);

    const updatedDelivery = await this.deliveryModel.findOneAndUpdate(
      {
        _id: delivery.id,
      },
      {
        paymentUrl: response.authUrl,
        paymentReference: response.reference,
      },
      {
        new: true,
      },
    );

    return updatedDelivery;
  }

  findUserDeliveries(userId: string) {
    return this.deliveryModel
      .find({
        user: userId,
      })
      .sort({
        createdAt: 'desc',
      });
  }

  findRiderDeliveries(riderId: string) {
    return this.deliveryModel
      .find({
        rider: riderId,
      })
      .sort({
        createdAt: 'desc',
      });
  }

  findDeliveries(status?: DeliveryStatus) {
    let filter = {};
    filter = status
      ? Object.assign(filter, {
          status,
        })
      : filter;
    return this.deliveryModel.find(filter).sort({
      createdAt: 'desc',
    });
  }

  async acceptDelivery(
    deliveryId: string,
    riderId: string,
    riderPaymentMethod: RiderPaymentMethod = RiderPaymentMethod.WALLET,
  ) {
    const delivery = await this.deliveryModel.findById(deliveryId);

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    if (delivery.status !== DeliveryStatus.OPEN) {
      throw new BadRequestException('Only open deliveries can be accepted');
    }

    const rider = await this.userModel.findById(riderId);

    if (
      riderPaymentMethod === RiderPaymentMethod.DISBURSE &&
      !rider.subaccountCode
    ) {
      throw new BadRequestException(
        'User must create withdrawal account before using disburse option',
      );
    }
    const updated = await this.deliveryModel.findOneAndUpdate(
      {
        _id: delivery.id,
      },
      {
        rider: riderId,
        status: DeliveryStatus.ACCEPTED,
        riderPaymentMethod,
      },
      {
        new: true,
      },
    );
    return updated;
  }

  findUserDelivery(userId: string, deliveryId: string) {
    return this.deliveryModel.findOne({
      user: userId,
      id: deliveryId,
    });
  }

  // update(id: number, updateDeliveryDto: UpdateDeliveryDto) {
  //   return `This action updates a #${id} delivery`;
  // }

  remove(id: number) {
    return `This action removes a #${id} delivery`;
  }
}
