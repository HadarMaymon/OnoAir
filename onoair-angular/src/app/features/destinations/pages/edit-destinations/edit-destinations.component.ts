import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestinationsService } from '../../service/destinations.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Destination } from '../../models/destination';

@Component({
  selector: 'app-edit-destinations',
  templateUrl: './edit-destinations.component.html',
  styleUrls: ['./edit-destinations.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
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
    this.destinationName = this.route.snapshot.paramMap.get('destinationName');

    if (this.destinationName) {
      this.destinationService.getDestinationByName(this.destinationName).subscribe({
        next: (data) => {
          if (data) {
            this.destination = data;
          } else {
            this.redirectToDestinationList();
          }
        },
        error: () => {
          this.redirectToDestinationList();
        },
      });
    } else {
      this.redirectToDestinationList();
    }
  }

  redirectToDestinationList(): void {
    alert('Destination not found. Redirecting to Manage Destination.');
    this.router.navigate(['/manage-destinations']);
  }

  deleteDestination(): void {
    if (this.destination) {
      const confirmDelete = confirm(`Are you sure you want to delete ${this.destination.destinationName}?`);
      if (confirmDelete) {
        this.destinationService
          .deleteDestination(this.destination.IATA)
          .then(() => {
            alert('Destination deleted successfully! Redirecting to Manage Destinations.');
            this.router.navigate(['/manage-destinations']);
          })
          .catch(() => {
            alert('Failed to delete destination. Please try again.');
          });
      }
    }
  }

  saveChanges(): void {
    if (this.destination) {
      this.destinationService
        .updateDestination(this.destination)
        .then(() => {
          alert('Changes saved successfully! Redirecting to Manage Destination.');
          this.router.navigate(['/manage-destinations']);
        })
        .catch(() => {
          alert('Failed to save changes. Please try again.');
        });
    }
  }
}
