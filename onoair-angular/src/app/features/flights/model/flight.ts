export class Flight {
  constructor(
    public flightNumber: string = '',
    public origin: string = '',
    public destination: string = '',
    public date: string = '',
    public departureTime: string = '',
    public arrivalDate: string = '',
    public arrivalTime: string = '',
    public price: number = 0,
    public image: string = '',
    public availableSeats: number = 0,
    public isDynamicDate: boolean = false
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
}
