import { PAYMENT_SERVICE_NAME, PaymentServiceClient } from '@app/common';
import { UserDto } from '@app/common/dto';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, map, of } from 'rxjs';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
// import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ReservationsService implements OnModuleInit {
  private paymentService: PaymentServiceClient;
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENT_SERVICE_NAME) private readonly client: ClientGrpc,
  ) {}
  onModuleInit() {
    this.paymentService =
      this.client.getService<PaymentServiceClient>(PAYMENT_SERVICE_NAME);
  }
  async create(
    createReservationDto: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ) {
    // return this.reservationsRepository.create({
    //   ...createReservationDto,
    //   // invoiceId: res.id,
    //   timestamp: new Date(),
    //   userId: userId,
    //   invoiceId: 'in123',
    // });
    return this.paymentService
      .createCharge({
        ...createReservationDto.charge,
        email,
      })
      .pipe(
        map((res) => {
          return this.reservationsRepository.create({
            ...createReservationDto,
            invoiceId: res.id,
            timestamp: new Date(),
            userId,
          });
        }),
        catchError(() => of(false)),
      );
  }

  async findAll() {
    return this.reservationsRepository.find({});
  }

  async findOne(_id: string) {
    return this.reservationsRepository.findOne({ _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  async remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id });
  }
}
