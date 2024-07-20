import { PAYMENTS_SERVICE } from '@app/common';
import { UserDto } from '@app/common/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, of } from 'rxjs';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
// import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}

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
    return this.paymentsService
      .send('create_charge', {
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
