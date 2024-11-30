import { Flight } from './Flight.js';

export class FlightData {
    constructor() {
        this.flights = [
            new Flight("W61283", "Tel Aviv", "Krakow", "16/7/2025 20:00", "17/7/2025 01:00", 120),
            new Flight("LX8396", "Larnaca", "Zurich", "20/8/2025 18:30", "20/8/2025 21:15", 85),
            new Flight("BA2547", "San Diego", "Madrid", "25/9/2025 10:00", "25/9/2025 18:00", 150),
            new Flight("AF3201", "Las Vegas", "Dubai", "12/10/2025 14:00", "13/10/2025 02:00", 200),
            new Flight("EK412", "Detroit", "Istanbul", "5/11/2025 06:00", "5/11/2025 16:00", 75),
            new Flight("LH2029", "Denver", "Vienna", "3/12/2025 08:00", "3/12/2025 16:30", 60),
            new Flight("DL1085", "Philadelphia", "Bangkok", "15/1/2026 12:00", "16/1/2026 04:00", 90),
            new Flight("AA1140", "Phoenix", "Stockholm", "23/2/2026 09:00", "23/2/2026 18:30", 45),
            new Flight("UA329", "Salt Lake City", "Sao Paulo", "1/3/2026 15:00", "2/3/2026 03:30", 110),
            new Flight("AZ754", "Minneapolis", "Cape Town", "9/4/2026 11:30", "10/4/2026 08:00", 50),
        ];
    }

    getFlights() {
        return this.flights;
    }
}
