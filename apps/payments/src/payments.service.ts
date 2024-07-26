import { NOTIFICATIONS_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2024-06-20',
    },
  );
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}
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

    this.notificationsService.emit('notify_email', {
      email,
      text: `Your payment of $${amount} has completed successfully.`,
    });

    return paymentIntent;
  }
  getHello(): string {
    return 'Hello World!';
  }
  async getPayments() {
    const payments = await this.stripe.paymentIntents.list();
    return payments.data;
  }
}
