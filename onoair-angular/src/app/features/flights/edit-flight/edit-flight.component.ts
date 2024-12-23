import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightService, Flight } from '../../../service/flights/flights';
import { RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-flight',
  templateUrl: './edit-flight.component.html',
  styleUrls: ['./edit-flight.component.css'],
  imports: [RouterLink,CommonModule, MatIconModule,MatButtonModule],
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
    alert('Flight not found. Redirecting to last-minute flights.');  // Optional alert
    this.router.navigate(['/last-minute-flight']);
  }
}
