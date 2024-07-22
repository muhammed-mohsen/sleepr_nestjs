import {
  NOTIFICATIONS_SERVICE_NAME,
  NotificationsServiceClient,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService implements OnModuleInit {
  private notificationService: NotificationsServiceClient;
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2024-06-20',
    },
  );
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}
  onModuleInit() {
    this.notificationService =
      this.client.getService<NotificationsServiceClient>(
        NOTIFICATIONS_SERVICE_NAME,
      );
  }
  async createCharge({ amount, email }: PaymentsCreateChargeDto) {
    // console.log('🚀 ~ PaymentsService ~ createCharge ~ email:', email);
    // const paymentMethod = await this.stripe.paymentMethods.create({
    //   // type: 'card',
    //   // card,
    //   payment_method: 'pm_card_visa',
    // });
    // console.log(
    //   '🚀 ~ PaymentsService ~ createCharge ~ paymentMethod:',
    //   paymentMethod,
    // );

    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: 'pm_card_visa',
      amount: amount * 100,
      confirm: true,
      payment_method_types: ['card'],
      currency: 'usd',
    });

    this.notificationService.notifyEmail({
      email,
      text: `Your payment of $${amount} has completed successfully.`,
    });

    return paymentIntent;
  }
  getHello(): string {
    return 'Hello World!';
  }
}
