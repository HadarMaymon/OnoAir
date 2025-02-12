import { FlightStatus } from './flight-status.enum';

export class Flight {
  constructor(
    public flightNumber: string,
    public origin: string,
    public destination: string,
    public date: Date, 
    public departureTime: string,
    public arrivalDate: Date, 
    public arrivalTime: string,
    public price: number,
    public image: string,
    public availableSeats: number,
    public isDynamicDate: boolean,
    public status: FlightStatus,
    public hasBookings: boolean,
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
