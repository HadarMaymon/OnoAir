export class Passenger {
  constructor(
    public name: string,
    public id: string,
    public luggage: {
      cabin: number;
      checked: number;
      heavy: number;
    } = { cabin: 0, checked: 0, heavy: 0 }
  ) {}
}
