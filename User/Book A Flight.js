class FlightDetails {
    constructor() {
        this.flights = [
            {
                flightNumber: "W61283",
                origin: "Tel Aviv",
                destination: "Krakow",
                boarding: "16/7/2025 20:00",
                landing: "17/7/2025 01:00",
            },
            {
                flightNumber: "LX8396",
                origin: "Larnaca",
                destination: "Zurich",
                boarding: "20/8/2025 18:30",
                landing: "20/8/2025 21:15",
            },
            {
                flightNumber: "BA2547",
                origin: "San Diego",
                destination: "Madrid",
                boarding: "25/9/2025 10:00",
                landing: "25/9/2025 18:00",
            },
            {
                flightNumber: "AF3201",
                origin: "Las Vegas",
                destination: "Dubai",
                boarding: "12/10/2025 14:00",
                landing: "13/10/2025 02:00",
            },
            {
                flightNumber: "EK412",
                origin: "Detroit",
                destination: "Istanbul",
                boarding: "5/11/2025 06:00",
                landing: "5/11/2025 16:00",
            },
            {
                flightNumber: "LH2029",
                origin: "Denver",
                destination: "Vienna",
                boarding: "3/12/2025 08:00",
                landing: "3/12/2025 16:30",
            },
            {
                flightNumber: "DL1085",
                origin: "Philadelphia",
                destination: "Bangkok",
                boarding: "15/1/2026 12:00",
                landing: "16/1/2026 04:00",
            },
            {
                flightNumber: "AA1140",
                origin: "Phoenix",
                destination: "Stockholm",
                boarding: "23/2/2026 09:00",
                landing: "23/2/2026 18:30",
            },
            {
                flightNumber: "UA329",
                origin: "Salt Lake City",
                destination: "Sao Paulo",
                boarding: "1/3/2026 15:00",
                landing: "2/3/2026 03:30",
            },
            {
                flightNumber: "AZ754",
                origin: "Minneapolis",
                destination: "Cape Town",
                boarding: "9/4/2026 11:30",
                landing: "10/4/2026 08:00",
            },
        ];
    }

    getFlights() {
        return this.flights;
    }
}

export default FlightDetails;
