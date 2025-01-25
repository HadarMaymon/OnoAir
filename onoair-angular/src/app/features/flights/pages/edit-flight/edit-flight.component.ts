import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../../service/flights.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Flight } from '../../model/flight';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-flight',
  templateUrl: './edit-flight.component.html',
  styleUrls: ['./edit-flight.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule],
})
export class EditFlightComponent implements OnInit {
  flight: Flight | undefined;
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
      this.flightService.getFlightByNumber(this.flightNumber).then((data) => {
        if (data) {
          this.flight = data; // Flight found
        } else {
          this.redirectToFlightList(); // Redirect if flight not found
        }
      }).catch(() => {
        this.redirectToFlightList(); // Redirect on error
      });
    } else {
      this.redirectToFlightList(); // Redirect if no flight number provided
    }
  }

  redirectToFlightList(): void {
    alert('Flight not found. Redirecting to Manage Flight.');
    this.router.navigate(['/manage-flight']);
  }

  saveChanges(): void {
    if (this.flight) {
      this.flightService.updateFlight(this.flight).then(() => {
        alert('Changes saved successfully!');
        this.router.navigate(['/manage-flight']);
      }).catch((error) => {
        console.error('Error saving changes:', error);
        alert('Failed to save changes. Please try again.');
      });
    }
  }
}
