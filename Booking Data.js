import { Booking } from './Booking.js';

export class BookingData {
    constructor() {
        this.bookings = [
            new Booking("../Images/krakow.jpg", "Krakow", "Tel Aviv", "16/7/2025 20:00", "Krakow", "17/7/2025 01:00", 5),
            new Booking("../Images/larnaca.jpeg", "Larnaca", "Krakow", "20/5/2024 20:00", "Larnaca", "21/5/2024 02:00", 6),
            new Booking("../Images/madrid.jpeg", "Madrid", "San Diego", "25/9/2025 10:00", "Madrid", "25/9/2025 18:00", 4),
            new Booking("../Images/dubai.jpeg", "Dubai", "Las Vegas", "12/10/2025 14:00", "Dubai", "13/10/2025 02:00", 2),
            new Booking("../Images/istanbul.jpeg", "Istanbul", "Detroit", "5/11/2025 06:00", "Istanbul", "5/11/2025 16:00", 3),
            new Booking("../Images/vienna.jpeg", "Vienna", "Denver", "3/12/2025 08:00", "Vienna", "3/12/2025 16:30", 1),
            new Booking("../Images/bangkok.jpeg", "Bangkok", "Philadelphia", "15/1/2026 12:00", "Bangkok", "16/1/2026 04:00", 7),
            new Booking("../Images/stockholm.jpeg", "Stockholm", "Phoenix", "23/2/2026 09:00", "Stockholm", "23/2/2026 18:30", 2),
            new Booking("../Images/sao paulo.jpeg", "Sao Paulo", "Salt Lake City", "1/3/2026 15:00", "Sao Paulo", "2/3/2026 03:30", 8),
            new Booking("../Images/cape town.jpeg", "Cape Town", "Minneapolis", "9/4/2026 11:30", "Cape Town", "10/4/2026 08:00", 3)
        ];
    }

    getBookings() {
        return this.bookings;
    }
}
