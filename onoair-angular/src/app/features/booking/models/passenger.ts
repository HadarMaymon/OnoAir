import { Luggage } from './luggage'; // ✅ Ensure import is correct

export class Passenger {
  constructor(
    public name: string,
    public id: string,
    public luggage: Luggage = new Luggage() // ✅ Use class instead of inline object
  ) {
    // Ensure luggage is never undefined
    if (!this.luggage) {
      this.luggage = new Luggage();
    }
  }
}
