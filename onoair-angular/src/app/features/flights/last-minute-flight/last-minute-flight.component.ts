import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FlightService, Flight } from '../../../service/flights/flights';
import { FindAFlightComponent } from '../find-a-flight/find-a-flight.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-last-minute-flight',
  templateUrl: './last-minute-flight.component.html',
  styleUrls: ['./last-minute-flight.component.css'],
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    FindAFlightComponent,
    RouterModule  
  ],
})
export class LastMinuteFlightComponent implements OnInit {
  lastMinuteFlights: Flight[] = [];

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.filterLastMinuteFlights();
  }

  private filterLastMinuteFlights(): void {
    const today = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);

    this.lastMinuteFlights = this.flightService
      .getAllFlights()
      .filter((flight) => {
        const flightDate = this.parseDate(flight.date);
        return flightDate >= today && flightDate <= oneWeekFromNow;
      });
  }

  bookFlight(flight: Flight): void {
    alert(`You have booked a flight to ${flight.destination} on ${flight.date}`);
    // Here you could add logic to send booking details to a backend service
  }

  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }
}
