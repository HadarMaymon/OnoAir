export class Passenger {
    constructor(
      public name: string,
      public id: string
    ) {}
  }
  
  export class Booking {
    constructor(
      public bookingId: string,
      public origin: string,
      public destination: string,
      public boarding: string = '',
      public landing: string = '',
      public numberOfPassengers: number,
      public passengers: Passenger[],
      public image: string = '',
      public isDynamicDate: boolean
    ) {}
  
    updateBoardingTime(time: string) {
      this.boarding = time;
    }
  
    updateLandingTime(time: string) {
      this.landing = time;
    }
  }