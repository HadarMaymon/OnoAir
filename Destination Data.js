import { Destination } from './Destination.js';

export class DestinationManager {
    constructor() {
        this.destinations = [
            new Destination(
                "Tel Aviv (Ben Gurion Airport)",
                "Krakow (John Paul II Airport)",
                "16/7/2025 20:00",
                "17/7/2025 01:00",
                "https://www.krakowairport.pl/"
            ),
            new Destination(
                "Larnaca (Larnaca International Airport)",
                "Zurich (Zurich Airport)",
                "20/8/2025 18:30",
                "20/8/2025 21:15",
                "https://www.zurich-airport.com/"
            ),
            new Destination(
                "San Diego (San Diego International Airport)",
                "Madrid (Madrid-Barajas Airport)",
                "25/9/2025 10:00",
                "25/9/2025 18:00",
                "https://www.aena.es/en/madrid-barajas.html"
            ),
            new Destination(
                "Las Vegas (Harry Reid International Airport)",
                "Dubai (Dubai International Airport)",
                "12/10/2025 14:00",
                "13/10/2025 02:00",
                "https://www.dubaiairports.ae/"
            ),
            new Destination(
                "Detroit (Detroit Metropolitan Airport)",
                "Istanbul (Istanbul Airport)",
                "5/11/2025 06:00",
                "5/11/2025 16:00",
                "https://www.istairport.com/en/"
            ),
            new Destination(
                "Denver (Denver International Airport)",
                "Vienna (Vienna International Airport)",
                "3/12/2025 08:00",
                "3/12/2025 16:30",
                "https://www.viennaairport.com/en/"
            ),
            new Destination(
                "Philadelphia (Philadelphia International Airport)",
                "Bangkok (Suvarnabhumi Airport)",
                "15/1/2026 12:00",
                "16/1/2026 04:00",
                "https://www.bangkokairportonline.com/"
            ),
            new Destination(
                "Phoenix (Phoenix Sky Harbor International Airport)",
                "Stockholm (Arlanda Airport)",
                "23/2/2026 09:00",
                "23/2/2026 18:30",
                "https://www.swedavia.com/arlanda/"
            ),
            new Destination(
                "Salt Lake City (Salt Lake City International Airport)",
                "Sao Paulo (Guarulhos International Airport)",
                "1/3/2026 15:00",
                "2/3/2026 03:30",
                "https://www.gru.com.br/en"
            ),
            new Destination(
                "Minneapolis (Minneapolis-Saint Paul International Airport)",
                "Cape Town (Cape Town International Airport)",
                "9/4/2026 11:30",
                "10/4/2026 08:00",
                "https://www.airports.co.za/"
            ),
        ];
    }

    getDestinations() {
        return this.destinations;
    }
}
