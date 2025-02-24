import { Passenger } from './passenger';
import { BookingStatus } from './booking-status.enum';
import { Luggage } from './luggage';

export class Booking {
  constructor(
    public bookingId: string,
    public flightNumber: string,
    public origin: string,
    public destination: string,
    public boarding: Date,
    public departureTime: string, 
    public landing: Date,
    public arrivalTime: string, 
    public numberOfPassengers: number,
    public passengers: Passenger[],
    public image: string = '',
    public isDynamicDate: boolean,
    public status: BookingStatus
  ) {}

  updateBoardingTime(time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    this.boarding.setHours(hours, minutes, 0, 0);
    this.departureTime = time; 
  }

  updateLandingTime(time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    this.landing.setHours(hours, minutes, 0, 0);
    this.arrivalTime = time; 
  }
}
