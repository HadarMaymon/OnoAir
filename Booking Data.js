class BookingData {
    constructor() {
        this.bookings = [
            {
                image: "../Images/krakow.jpg",
                alt: "Krakow",
                origin: "Tel Aviv",
                boarding: "16/7/2025 20:00",
                destination: "Krakow",
                landing: "17/7/2025 01:00",
                passengers: 5
            },
            {
                image: "../Images/larnaca.jpeg",
                alt: "Larnaca",
                origin: "Krakow",
                boarding: "20/5/2024 20:00",
                destination: "Larnaca",
                landing: "21/5/2024 02:00",
                passengers: 6
            },
            {
                image: "../Images/madrid.jpeg",
                alt: "Madrid",
                origin: "San Diego",
                boarding: "25/9/2025 10:00",
                destination: "Madrid",
                landing: "25/9/2025 18:00",
                passengers: 4
            },
            {
                image: "../Images/dubai.jpeg",
                alt: "Dubai",
                origin: "Las Vegas",
                boarding: "12/10/2025 14:00",
                destination: "Dubai",
                landing: "13/10/2025 02:00",
                passengers: 2
            },
            {
                image: "../Images/istanbul.jpeg",
                alt: "Istanbul",
                origin: "Detroit",
                boarding: "5/11/2025 06:00",
                destination: "Istanbul",
                landing: "5/11/2025 16:00",
                passengers: 3
            },
            {
                image: "../Images/vienna.jpeg",
                alt: "Vienna",
                origin: "Denver",
                boarding: "3/12/2025 08:00",
                destination: "Vienna",
                landing: "3/12/2025 16:30",
                passengers: 1
            },
            {
                image: "../Images/bangkok.jpeg",
                alt: "Bangkok",
                origin: "Philadelphia",
                boarding: "15/1/2026 12:00",
                destination: "Bangkok",
                landing: "16/1/2026 04:00",
                passengers: 7
            },
            {
                image: "../Images/stockholm.jpeg",
                alt: "Stockholm",
                origin: "Phoenix",
                boarding: "23/2/2026 09:00",
                destination: "Stockholm",
                landing: "23/2/2026 18:30",
                passengers: 2
            },
            {
                image: "../Images/sao paulo.jpeg",
                alt: "Sao Paulo",
                origin: "Salt Lake City",
                boarding: "1/3/2026 15:00",
                destination: "Sao Paulo",
                landing: "2/3/2026 03:30",
                passengers: 8
            },
            {
                image: "../Images/cape town.jpeg",
                alt: "Cape Town",
                origin: "Minneapolis",
                boarding: "9/4/2026 11:30",
                destination: "Cape Town",
                landing: "10/4/2026 08:00",
                passengers: 3
            }
        ];
    }

    getBookings() {
        return this.bookings;
    }
}

export default BookingData;
