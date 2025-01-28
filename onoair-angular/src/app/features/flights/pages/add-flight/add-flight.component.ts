import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlightService } from '../../service/flights.service';
import { Flight } from '../../model/flight';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
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
  selector: 'app-add-flight',
  templateUrl: './add-flight.component.html',
  styleUrls: ['./add-flight.component.css'],
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, ConfirmDialogComponent, MatSelectModule, MatOptionModule
     ,MatOption],
})
export class AddFlightComponent implements OnInit {
  flight: Flight = {
    flightNumber: '',
    origin: '',
    destination: '',
    date: '',
    departureTime: '',
    duration: '',
    arrivalDate: '',
    arrivalTime: '',
    price: 0,
    availableSeats: 0,
    image: '',
    isDynamicDate: false,
    updatePrice: () => {},
    updateSeats: () => {},
    assignDynamicDate: () => {},
  };

  origins: string[] = [];
  destinations: string[] = [];

  constructor(
    private flightService: FlightService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.flightService.getOrigins().then((origins) => (this.origins = origins));
    this.flightService.getDestinations().then(
      (destinations) => (this.destinations = destinations)
    );
  }

  addFlight(flightForm: any): void {
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
  
    // Format date and arrivalDate
    if (this.flight.date) {
      this.flight.date = new Date(this.flight.date).toISOString().split('T')[0];
    }
    if (this.flight.arrivalDate) {
      this.flight.arrivalDate = new Date(this.flight.arrivalDate).toISOString().split('T')[0];
    }
  
    // Show confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { type: 'save', name: `flight ${this.flight.flightNumber}` },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.confirmed) {
        // Save flight to Firestore
        this.flightService.addFlight(this.flight).then(() => {
          const successDialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: {
              title: 'Success',
              message: 'Flight added successfully!',
            },
          });
  
          successDialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/manage-flight']);
          });
        }).catch((error) => {
          this.dialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: {
              title: 'Error',
              message: 'Failed to add flight. Please try again.',
            },
          });
          console.error('Error adding flight:', error);
        });
      }
    });
  }
}  
