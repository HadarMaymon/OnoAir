import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../../service/flights/flights';
import { RouterModule } from '@angular/router';
import { Flight } from '../../../models/flight';

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
    RouterModule  
  ],
})
export class LastMinuteFlightComponent implements OnInit {
  lastMinuteFlights: Flight[] = [];

  constructor(private flightService: FlightService, private router: Router) {}

  ngOnInit(): void {
    this.filterLastMinuteFlights();
  }
  
  private filterLastMinuteFlights(): void {
    const today = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);
  
    this.flightService.getAllFlights().subscribe((flights) => {
      this.lastMinuteFlights = flights.filter((flight) => {
        const flightDate = this.parseDate(flight.date);
        return flightDate >= today && flightDate <= oneWeekFromNow;
      });
    });
  }
  

  bookFlight(flight: Flight): void {
    // Navigate to book-a-flight component
    this.router.navigateByUrl(
      `/book-a-flight?destination=${flight.destination}&origin=${flight.origin}&date=${flight.date}&price=${flight.price}`
    );
  }

  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }
}
