import {
  PaymentServiceController,
  PaymentServiceControllerMethods,
} from '@app/common';
import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
import { PaymentsService } from './payments.service';

@Controller()
@PaymentServiceControllerMethods()
export class PaymentsController implements PaymentServiceController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  getHello(): string {
    return this.paymentsService.getHello();
  }
  @UsePipes(new ValidationPipe())
  async createCharge(data: PaymentsCreateChargeDto) {
    return this.paymentsService.createCharge(data);
  }
}
