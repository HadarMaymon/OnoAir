export class Destination {
    constructor(
      public destinationName: string,
      public airportName: string,
      public airportWebsite: string,
      public IATA: string,
      public timeZone: string,
      public currency: string,
      public image: string
    ) {}
  
    updateCurrency(newCurrency: string): void {
      this.currency = newCurrency;
    }
  }