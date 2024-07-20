import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  getHello(): string {
    return this.paymentsService.getHello();
  }
  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe())
  async createCharge(@Payload() data: PaymentsCreateChargeDto) {
    return this.paymentsService.createCharge(data);
  }
}
