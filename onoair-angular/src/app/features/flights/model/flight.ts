import { FlightStatus } from './flight-status.enum';

export class Flight {
  constructor(
    public flightNumber: string = '',
    public origin: string = '',
    public destination: string = '',
    public date: Date = new Date(), 
    public departureTime: string = '',
    public arrivalDate: Date = new Date(), 
    public arrivalTime: string = '',
    public price: number = 0,
    public image: string = '',
    public availableSeats: number = 0,
    public isDynamicDate: boolean = false,
    public status: FlightStatus = FlightStatus.Active,
    public hasBookings: boolean = false
  ) {}

  updatePrice(newPrice: number) {
    this.price = newPrice;
  }

  updateSeats(newSeats: number) {
    this.availableSeats = newSeats;
  }

  assignDynamicDate(dynamic: boolean) {
    this.isDynamicDate = dynamic;
  }

  updateStatus(newStatus: FlightStatus) {
    this.status = newStatus;
  }
}
