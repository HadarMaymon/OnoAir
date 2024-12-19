import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { DestinationService, Destination } from '../../../service/destination/destination.service';

@Component({
  selector: 'app-last-minute-flight',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './last-minute-flight.component.html',
  styleUrls: ['./last-minute-flight.component.css'],
})
export class LastMinuteFlightComponent implements OnInit {
  flights: Destination[] = [];

  constructor(
    @Inject(DestinationService) private destinationService: DestinationService,
    private router: Router // Inject the Router
  ) {}

  ngOnInit(): void {
    this.flights = this.destinationService.getAllFlights();
  }

  onFindFlightClick(): void {
    this.router.navigate(['./find-a-flight']); 
  }
}
