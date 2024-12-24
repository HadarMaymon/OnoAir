import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightService, Flight } from '../../../service/flights/flights';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-a-flight',
  templateUrl: './book-a-flight.component.html',
  styleUrls: ['./book-a-flight.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
})
export class BookAFlightComponent implements OnInit {
  flight: Flight | null = null;
  flightNumber: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the flight number from URL
    this.flightNumber = this.route.snapshot.paramMap.get('flightNumber');

    if (this.flightNumber) {
      this.flightService.getFlightByNumber(this.flightNumber).subscribe({
        next: (data) => {
          if (data) {
            this.flight = data;  // Flight found, render details
          } else {
            this.redirectToFlightList();  // Redirect if flight not found
          }
        },
        error: () => {
          this.redirectToFlightList();  // Redirect on error
        }
      });
    } else {
      this.redirectToFlightList();  // Redirect if no flight number provided
    }
  }

  redirectToFlightList(): void {
    alert('Flight not found. Redirecting to homepage.');  
    this.router.navigate(['/last-minute-flight']);
  }

  confirmBooking(): void {
    if (this.flight) {
      alert(`Flight to ${this.flight.destination} has been booked successfully!`);
      this.router.navigate(['/last-minute-flight']);  // Redirect after booking
    } else {
      alert('No flight selected. Please try again.');
    }
  }
  
}
