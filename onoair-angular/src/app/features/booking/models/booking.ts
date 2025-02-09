import { Passenger } from '../../destinations/models/passenger';
import { BookingStatus

 } from './booking-status.enum';
  export class Booking {
    constructor(
      public bookingId: string,
      public flightNumber: string,
      public origin: string,
      public destination: string,
      public boarding: string = '',
      public landing: string = '',
      public numberOfPassengers: number,
      public passengers: Passenger[],
      public image: string = '',
      public isDynamicDate: boolean,
      public status: BookingStatus
    ) {}
  
    updateBoardingTime(time: string) {
      this.boarding = time;
    }
  
    updateLandingTime(time: string) {
      this.landing = time;
    }
  }