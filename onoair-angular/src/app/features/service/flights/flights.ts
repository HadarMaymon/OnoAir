import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DestinationsService } from '../destinations/destinations.service';
import { Flight } from '../../models/flight';


@Injectable({
  providedIn: 'root',
})

export class FlightService {
  private flights: Flight[] = [
    new Flight('ON1234', 'Paris', 'Berlin', '29/1/2025', '10:30 AM', '1h 50m', 200, '', 10, false),
    new Flight('ON5678', 'London', 'Dublin', '31/1/2025', '2:00 PM', '1h 20m', 150, '', 3, false),
    new Flight('ON9101', 'Tel Aviv', 'Paris', '', '5:00 PM', '4h 30m', 300, '', 7, true),
    new Flight('ON1213', 'Los Angeles', 'Bora Bora', '', '9:00 AM', '8h 20m', 800, '', 27, true),
    new Flight('ON1415', 'Tokyo', 'Los Angeles', '', '11:00 AM', '12h 10m', 600, '', 15, true),
    new Flight('ON1617', 'San Francisco', 'New York', '8/1/2025', '7:30 AM', '6h 15m', 350, '', 5, false),
    new Flight('ON1819', 'Beijing', 'Pyongyang', '', '3:00 PM', '2h 0m', 250, '', 9, true),
    new Flight('ON2021', 'Chicago', 'San Francisco', '15/1/2025', '4:00 PM', '4h 30m', 300, '', 7, false),
    new Flight('ON2223', 'Singapore', 'Thailand', '', '12:30 PM', '2h 10m', 200, '', 11, true),
    new Flight('ON2425', 'Sydney', 'Tokyo', '', '10:00 PM', '9h 40m', 700, '', 19, true),
  ];

  constructor(private destinationsService: DestinationsService) {}

  getAllFlights(): Observable<Flight[]> {
    this.assignDynamicDates();

    const flightRequests = this.flights.map(flight =>
      this.destinationsService.getDestinationByName(flight.destination).pipe(
        map(destination => {
          flight.image = destination?.image || 'https://via.placeholder.com/300';
          return flight;
        })
      )
    );

    return forkJoin(flightRequests);
  }

  private assignDynamicDates(): void {
    this.flights.forEach((flight, index) => {
      if (flight.isDynamicDate) {
        const newDate = this.getFutureDate(index + 1);
        flight.assignDynamicDate(newDate);
      }
    });
  }

  private getFutureDate(daysToAdd: number): string {
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);
    return today.toLocaleDateString('en-GB');
  }

  getFlightByNumber(flightNumber: string): Observable<Flight | undefined> {
    const flight = this.flights.find(f => f.flightNumber === flightNumber);
    return of(flight);
  }
}

