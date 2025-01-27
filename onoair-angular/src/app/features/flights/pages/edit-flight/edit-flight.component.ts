import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../../service/flights.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Flight } from '../../model/flight';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog'; 
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { MatOption} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
@Component({
  selector: 'app-edit-flight',
  templateUrl: './edit-flight.component.html',
  styleUrls: ['./edit-flight.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule
    ,MatOption, MatSelectModule, MatOptionModule
  ],
})
export class EditFlightComponent implements OnInit {
  flight: Flight | undefined;
  flightNumber: string | null = null;
  origin: string[] = [];
  destination: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService,
    private router: Router,
    private dialog: MatDialog // Inject MatDialog
    
  ) {}

  ngOnInit(): void {
    const flightNumber = this.route.snapshot.paramMap.get('flightNumber');

    if (!flightNumber) {
      this.redirectToFlightList();
      return;
    }

    this.flightService.getOrigins().then((data) => (this.origin = data));
    this.flightService.getDestinations().then((data) => (this.destination = data));
    
    this.flightService.getFlightByNumber(flightNumber)
      .then((flight) => {
        if (flight) {
          this.flight = flight;
        } else {
          this.redirectToFlightList();
        }
      })
      .catch(() => this.redirectToFlightList());
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

  saveChanges(flightForm: any): void {
    if (flightForm.invalid) {
      // Show error dialog if the form is invalid
      this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: {
          title: 'Error',
          message: 'Please fill in all required fields before saving.',
          showConfirmButton: false,
          showCloseButton: true,
        },
      });
      return;
    }
  
    if (this.flight) {
      // Format date and arrivalDate
      if (this.flight.date) {
        this.flight.date = new Date(this.flight.date).toISOString().split('T')[0];
      }
      if (this.flight.arrivalDate) {
        this.flight.arrivalDate = new Date(this.flight.arrivalDate).toISOString().split('T')[0];
      }
  
      // Call the service to update the flight
      this.flightService.updateFlight(this.flight).then(() => {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {
            title: 'Success',
            message: 'Changes saved successfully!',
          },
        });
  
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/manage-flight']);
        });
      }).catch((error) => {
        this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {
            title: 'Error',
            message: 'Failed to save changes. Please try again.',
          },
        });
        console.error('Error saving changes:', error);
      });
    }
  }  
  }
