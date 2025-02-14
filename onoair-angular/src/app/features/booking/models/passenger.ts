import { Luggage } from './luggage'; 

export class Passenger {
  constructor(
    public name: string,
    public id: string,
    public luggage: Luggage = new Luggage(0, 0, 0) 
  ) {
    // Ensure luggage is never undefined
    if (!this.luggage) {
      this.luggage = new Luggage();
    }
  }
}
