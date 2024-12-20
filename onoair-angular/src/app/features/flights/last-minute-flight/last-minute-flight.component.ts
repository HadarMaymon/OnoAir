import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FlightService, Flight } from '../../../service/flights/flights'; // Updated Service Name
import { FindAFlightComponent } from '../find-a-flight/find-a-flight.component';

@Component({
  selector: 'app-last-minute-flight',
  templateUrl: './last-minute-flight.component.html',
  styleUrls: ['./last-minute-flight.component.css'],
  standalone: true, // Marked as standalone to allow direct imports
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    FindAFlightComponent,
  ],
})
export class LastMinuteFlightComponent implements OnInit {
  lastMinuteFlights: Flight[] = []; // Updated to use `Flight` interface

  constructor(private flightService: FlightService) {} // Corrected service instance name

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

  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }
}
