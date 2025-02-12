import { Passenger } from '../../destinations/models/passenger';
import { BookingStatus} from './booking-status.enum';

 export class Booking {
  constructor(
    public bookingId: string,
    public flightNumber: string,
    public origin: string,
    public destination: string,
    public boarding: Date,
    public landing: Date,
    public numberOfPassengers: number,
    public passengers: Passenger[],
    public image: string = '',
    public isDynamicDate: boolean,
    public status: BookingStatus
  ) {}

  updateBoardingTime(time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    this.boarding.setHours(hours, minutes, 0, 0); // ✅ Modify the Date object
  }

  updateLandingTime(time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    this.landing.setHours(hours, minutes, 0, 0); // ✅ Modify the Date object
  }
}
