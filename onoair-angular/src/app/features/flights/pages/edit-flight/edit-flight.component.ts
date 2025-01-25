import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../../service/flights.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Flight } from '../../model/flight';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component'; // Import dialog component

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
    private router: Router,
    private dialog: MatDialog // Inject MatDialog
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
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Error',
        message: 'Flight not found. Redirecting to Manage Flight.',
        showConfirmButton: false,
        showCloseButton: true,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/manage-flight']);
    });
  }

  saveChanges(): void {
    if (this.flight) {
      this.flightService.updateFlight(this.flight).then(() => {
        // Open a success dialog
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {
            title: 'Success',
            message: 'Changes saved successfully!',
            showConfirmButton: false,
            showCloseButton: true,
          },
        });

        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/manage-flight']);
        });
      }).catch((error) => {
        // Open an error dialog
        this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {
            title: 'Error',
            message: 'Failed to save changes. Please try again.',
            showConfirmButton: false,
            showCloseButton: true,
          },
        });
        console.error('Error saving changes:', error);
      });
    }
  }
}
