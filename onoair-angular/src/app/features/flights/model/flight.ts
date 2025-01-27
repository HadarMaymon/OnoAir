export class Flight {
    constructor(
      public flightNumber: string,
      public origin: string,
      public destination: string,
      public date: string,
      public departureTime: string,
      public duration: string,
      public arrivalDate: string,
      public arrivalTime: string,
      public price: number,
      public image: string = '',
      public availableSeats: number,
      public isDynamicDate: boolean
    ) {}
  
    updatePrice(newPrice: number): void {
      this.price = newPrice;
    }
  

    updateSeats(seats: number): void {
      this.availableSeats = seats;
    }
  
    assignDynamicDate(date: string): void {
      this.date = date;
    }
  }
  