import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '../../service/flights';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-flight',
  templateUrl: './edit-flight.component.html',
  styleUrls: ['./edit-flight.component.css'],
  imports: [CommonModule, MatIconModule,MatButtonModule],
})
export class EditFlightComponent implements OnInit {
  flight: any;
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
            this.flight = data;  // Flight found
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
    alert('Flight not found. Redirecting to Manage Flight.');  
    this.router.navigate(['/manage-flight']);
  }

  saveChanges(): void {
    alert('Changes saved successfully! Redirecting to homepage.');
    this.router.navigate(['/homepage']);  
  }
  
}
