class DestinationData {
    constructor() {
        this.destinations = [
            {
                departure: "Tel Aviv (Ben Gurion Airport)",
                arrival: "Krakow (John Paul II Airport)",
                departureTime: "16/7/2025 20:00",
                arrivalTime: "17/7/2025 01:00",
                airportWebsite: "https://www.krakowairport.pl/"
            },
            {
                departure: "Larnaca (Larnaca International Airport)",
                arrival: "Zurich (Zurich Airport)",
                departureTime: "20/8/2025 18:30",
                arrivalTime: "20/8/2025 21:15",
                airportWebsite: "https://www.zurich-airport.com/"
            },
            {
                departure: "San Diego (San Diego International Airport)",
                arrival: "Madrid (Madrid-Barajas Airport)",
                departureTime: "25/9/2025 10:00",
                arrivalTime: "25/9/2025 18:00",
                airportWebsite: "https://www.aena.es/en/madrid-barajas.html"
            },
            {
                departure: "Las Vegas (Harry Reid International Airport)",
                arrival: "Dubai (Dubai International Airport)",
                departureTime: "12/10/2025 14:00",
                arrivalTime: "13/10/2025 02:00",
                airportWebsite: "https://www.dubaiairports.ae/"
            },
            {
                departure: "Detroit (Detroit Metropolitan Airport)",
                arrival: "Istanbul (Istanbul Airport)",
                departureTime: "5/11/2025 06:00",
                arrivalTime: "5/11/2025 16:00",
                airportWebsite: "https://www.istairport.com/en/"
            },
            {
                departure: "Denver (Denver International Airport)",
                arrival: "Vienna (Vienna International Airport)",
                departureTime: "3/12/2025 08:00",
                arrivalTime: "3/12/2025 16:30",
                airportWebsite: "https://www.viennaairport.com/en/"
            },
            {
                departure: "Philadelphia (Philadelphia International Airport)",
                arrival: "Bangkok (Suvarnabhumi Airport)",
                departureTime: "15/1/2026 12:00",
                arrivalTime: "16/1/2026 04:00",
                airportWebsite: "https://www.bangkokairportonline.com/"
            },
            {
                departure: "Phoenix (Phoenix Sky Harbor International Airport)",
                arrival: "Stockholm (Arlanda Airport)",
                departureTime: "23/2/2026 09:00",
                arrivalTime: "23/2/2026 18:30",
                airportWebsite: "https://www.swedavia.com/arlanda/"
            },
            {
                departure: "Salt Lake City (Salt Lake City International Airport)",
                arrival: "Sao Paulo (Guarulhos International Airport)",
                departureTime: "1/3/2026 15:00",
                arrivalTime: "2/3/2026 03:30",
                airportWebsite: "https://www.gru.com.br/en"
            },
            {
                departure: "Minneapolis (Minneapolis-Saint Paul International Airport)",
                arrival: "Cape Town (Cape Town International Airport)",
                departureTime: "9/4/2026 11:30",
                arrivalTime: "10/4/2026 08:00",
                airportWebsite: "https://www.airports.co.za/"
            }
        ];
    }

    getDestinations() {
        return this.destinations;
    }

    addDestination(destination) {
        this.destinations.push(destination);
    }
}

export default DestinationData;
