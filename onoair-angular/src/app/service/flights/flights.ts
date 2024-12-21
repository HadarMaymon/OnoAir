import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Flight {
  flightNumber: string;
  origin: string; 
  destination: string; 
  date: string; 
  departureTime: string;
  duration: string; 
  price: number; 
  image: string; 
  availableSeats: number;
  isDynamicDate: boolean; 
}

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private flights: Flight[] = [
    {
      flightNumber: 'ON1234',
      origin: 'Paris (Charles de Gaulle Airport)', // Destination
      destination: 'Berlin (Berlin Brandenburg Airport)', // Origin
      date: '29/1/2025',
      departureTime: '10:30 AM',
      duration: '1h 50m',
      price: 200,
      image: 'assets/destinations/berlin.jpeg',
      isDynamicDate: false,
      availableSeats: 10,
    },
    {
      flightNumber: 'ON5678',
      origin: 'London (Heathrow Airport)', // Destination
      destination: 'Dublin (Dublin Airport)', // Origin
      date: '31/1/2025',
      departureTime: '2:00 PM',
      duration: '1h 20m',
      price: 150,
      image: 'assets/destinations/dublin.jpeg',
      isDynamicDate: false,
      availableSeats: 3,
    },
    {
      flightNumber: 'ON9101',
      origin: 'Tel Aviv (Ben Gurion Airport)', // Destination
      destination: 'Paris (Charles de Gaulle Airport)', // Origin
      date: '',
      departureTime: '5:00 PM',
      duration: '4h 30m',
      price: 300,
      image: 'assets/destinations/paris.jpeg',
      isDynamicDate: true,
      availableSeats: 7,
    },
    {
      flightNumber: 'ON1213',
      origin: 'Los Angeles (LAX)', // Destination
      destination: 'Bora Bora (Motu Mute Airport)', // Origin
      date: '',
      departureTime: '9:00 AM',
      duration: '8h 20m',
      price: 800,
      image: 'assets/destinations/bora-bora.jpeg',
      isDynamicDate: true,
      availableSeats: 27,
    },
    {
      flightNumber: 'ON1415',
      origin: 'Tokyo (Narita Airport)', // Destination
      destination: 'Los Angeles (LAX)', // Origin
      date: '',
      departureTime: '11:00 AM',
      duration: '12h 10m',
      price: 600,
      image: 'assets/destinations/los-angeles.jpeg',
      isDynamicDate: true,
      availableSeats: 15,
    },
    {
      flightNumber: 'ON1617',
      origin: 'San Francisco (SFO)', // Destination
      destination: 'New York (JFK)', // Origin
      date: '8/1/2025',
      departureTime: '7:30 AM',
      duration: '6h 15m',
      price: 350,
      image: 'assets/destinations/new_york.jpeg',
      isDynamicDate: false,
      availableSeats: 5,
    },
    {
      flightNumber: 'ON1819',
      origin: 'Beijing (Beijing Capital Airport)', // Destination
      destination: 'Pyongyang (Pyongyang Sunan International Airport)', // Origin
      date: '',
      departureTime: '3:00 PM',
      duration: '2h 0m',
      price: 250,
      image: 'assets/destinations/pyongyang.jpeg',
      isDynamicDate: true,
      availableSeats: 9,
    },
    {
      flightNumber: 'ON2021',
      origin: 'Chicago (O’Hare International Airport)', // Destination
      destination: 'San Francisco (SFO)', // Origin
      date: '15/1/2025',
      departureTime: '4:00 PM',
      duration: '4h 30m',
      price: 300,
      image: 'assets/destinations/san francisco.jpeg',
      isDynamicDate: false,
      availableSeats: 7,
    },
    {
      flightNumber: 'ON2223',
      origin: 'Singapore (Changi Airport)', // Destination
      destination: 'Thailand (Suvarnabhumi Airport)', // Origin
      date: '',
      departureTime: '12:30 PM',
      duration: '2h 10m',
      price: 200,
      image: 'assets/destinations/thailand.jpeg',
      isDynamicDate: true,
      availableSeats: 11,
    },
    {
      flightNumber: 'ON2425',
      origin: 'Sydney (Kingsford Smith Airport)', // Destination
      destination: 'Tokyo (Narita Airport)', // Origin
      date: '',
      departureTime: '10:00 PM',
      duration: '9h 40m',
      price: 700,
      image: 'assets/destinations/tokyo.jpeg',
      isDynamicDate: true,
      availableSeats: 19,
    },
  ];

  getAllFlights(): Flight[] {
    this.assignDynamicDates();  // Ensure dates are assigned before returning flights
    return this.flights;
  }
  

  private assignDynamicDates(): void {
    this.flights.forEach((flight, index) => {
      if (flight.isDynamicDate) {
        flight.date = this.getFutureDate(index + 1);
      }
    });
  }

  private getFutureDate(daysToAdd: number): string {
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);
    return today.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
  }

  getFlightByNumber(flightNumber: string): Observable<any> {
    const flight = this.flights.find(f => f.flightNumber === flightNumber);
    return of(flight);  // Return Observable (null if not found)
  }


}
