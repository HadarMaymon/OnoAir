import { Injectable } from '@angular/core';

export interface Destination {
  destination: string;
  date: string;
  image: string;
}

@Injectable({
  providedIn: 'root',
})

export class DestinationService {
  private flights: Destination[] = [
    { destination: 'Berlin', date: '29.1.2025', image: 'assets/destinations/berlin.jpeg' },
    { destination: 'Dublin', date: '31.1.2025', image: 'assets/destinations/dublin.jpeg' },
    { destination: 'Paris', date: '1.2.2025', image: 'assets/destinations/paris.jpeg' },
    { destination: 'Bora Bora', date: '10.1.2025', image: 'assets/destinations/bora-bora.jpeg' },
    { destination: 'los Angeles', date: '3.1.2025', image: 'assets/destinations/los-angeles.jpeg' },
    { destination: 'New York', date: '8.1.2025', image: 'assets/destinations/new_york.jpeg' },
    { destination: 'Los Angeles', date: '7.1.2025', image: 'assets/destinations/los-angeles.jpeg' },
    { destination: 'Pyongyang', date: '5.1.2025', image: 'assets/destinations/pyongyang.jpeg' },
    { destination: 'San Francisco', date: '15.1.2025', image: 'assets/destinations/san francisco.jpeg' },
    { destination: 'Thailand', date: '18.1.2025', image: 'assets/destinations/thailand.jpeg' },
    { destination: 'Tokyo', date: '11.1.2025', image: 'assets/destinations/tokyo.jpeg' },
  ];

  getAllFlights(): Destination[] {
    return this.flights;
  }
}
