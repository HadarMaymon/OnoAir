import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestinationsService, Destination } from '../../../service/destinations/destinations.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-destinations',
  templateUrl: './edit-destinations.component.html',
  styleUrls: ['./edit-destinations.component.css'],
  imports: [RouterLink, CommonModule, MatIconModule, MatButtonModule],
})
export class EditDestinationsComponent implements OnInit {
  destination: Destination | undefined;
  destinationName: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private destinationService: DestinationsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the destination name from URL
    this.destinationName = this.route.snapshot.paramMap.get('destinationName');

    if (this.destinationName) {
      this.destinationService.getDestinationByName(this.destinationName).subscribe({
        next: (data) => {
          if (data) {
            this.destination = data;  // Destination found, render details
          } else {
            this.redirectToDestinationList();  // Redirect if not found
          }
        },
        error: () => {
          this.redirectToDestinationList();  // Redirect on error
        }
      });
    } else {
      this.redirectToDestinationList();  // Redirect if no name provided
    }
  }

  redirectToDestinationList(): void {
    alert('Destination not found. Redirecting to destinations list.');  
    this.router.navigate(['/destinations']);
  }
}
