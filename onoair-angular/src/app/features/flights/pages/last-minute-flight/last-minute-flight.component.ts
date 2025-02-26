import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../service/flights.service';
import { RouterModule } from '@angular/router';
import { Flight } from '../../model/flight';

@Component({
  selector: 'app-last-minute-flight',
  templateUrl: './last-minute-flight.component.html',
  styleUrls: ['./last-minute-flight.component.css'],
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
  ],
})
export class LastMinuteFlightComponent implements OnInit {
  lastMinuteFlights: Flight[] = [];

  constructor(private flightService: FlightService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to real-time flights and filter last-minute flights
    this.flightService.flights$.subscribe((flights) => {
      this.filterLastMinuteFlights(flights);
    });
  }

  private filterLastMinuteFlights(flights: Flight[]): void {
    const today = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);
  
    console.log("Today:", today);
    console.log("One Week From Now:", oneWeekFromNow);
  
// Filter flights occurring within the next 7 days
this.lastMinuteFlights = flights.filter((flight) => {
  const flightDate = new Date(flight.date); 
  console.log(`Flight Date (${flight.date}):`, flightDate);

  return flightDate >= today && flightDate <= oneWeekFromNow;
});

console.log("Filtered Flights:", this.lastMinuteFlights);
}
  
  

  bookFlight(flight: Flight): void {
    // Navigate to booking page with flight details
    this.router.navigateByUrl(
      `/book-a-flight?destination=${flight.destination}&origin=${flight.origin}&date=${flight.date}&price=${flight.price}`
    );
  }

  
}
