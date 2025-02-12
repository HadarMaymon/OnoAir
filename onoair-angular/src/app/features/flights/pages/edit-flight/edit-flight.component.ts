import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { DestinationsService } from '../../../destinations/service/destinations.service';
import { ChangeDetectorRef } from '@angular/core';
import { FlightStatus } from '../../model/flight-status.enum';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-edit-flight',
  templateUrl: './edit-flight.component.html',
  styleUrls: ['./edit-flight.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatOption,
    MatSelectModule
  ],
})
export class EditFlightComponent implements OnInit {

  @Input() flightNumber: string | null = null;
  flight: Flight | undefined;
  origin: string[] = [];
  destination: string[] = [];
  minDate: string = '';

  FlightStatus = FlightStatus;

  constructor(
    private flightService: FlightService,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private destinationsService: DestinationsService
  ) {}

  ngOnInit(): void {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    this.minDate = today.toISOString().split('T')[0];
  
    this.destinationsService.getAllDestinations().then((destinations) => {
      const destinationNames = destinations.map((dest) => dest.destinationName);
      this.origin = destinationNames;
      this.destination = destinationNames;
  
      if (!this.flightNumber) {
        this.redirectToFlightList();
        return;
      }
  
      if (this.flightNumber === 'new') {
        this.resetForm('');
        return;
      }
  
      this.flightService.getFlightByNumber(this.flightNumber).then((flight) => {
        if (!flight) {
          this.redirectToFlightList();
          return;
        }
  
        this.flight = flight;
  
        //Get earliest active booking date
        this.flightService.getLatestBookingDate(this.flightNumber !).then((bookingDate) => {
          if (bookingDate) {
            this.flight!.date = bookingDate; // Override flight date with latest boarding date
          }
        });
  
        //Check if there are active bookings
        this.flightService.hasActiveBookings(this.flightNumber !).then((hasBookings) => {
          this.flight!.hasBookings = hasBookings;
        });
      });
    });
  }
  
  
  
  
  

  validateFlightNumber(event: KeyboardEvent): void {
    const allowedPattern = /^[A-Za-z0-9]+$/;
    const key = event.key;

    if (!allowedPattern.test(key) && key !== 'Backspace' && key !== 'Tab') {
      event.preventDefault();
    }
  }

  onFlightNumberChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newFlightNumber = inputElement.value.trim();

    if (!newFlightNumber) return;

    this.flightService.getFlightByNumber(newFlightNumber).then((flight) => {
      if (flight) {
        this.flight = flight;
      } else {
        this.resetForm(newFlightNumber);
      }
    }).catch((error) => {
      console.error('Error fetching flight:', error);
      this.resetForm(newFlightNumber);
    });
  }
  
  get isEditingAllowed(): boolean {
    if (!this.flight) return false; // Prevent editing if flight is not loaded
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    // Use latest active booking date (which was fetched in ngOnInit)
    const latestBookingDate = new Date(this.flight.date);
    latestBookingDate.setHours(0, 0, 0, 0);
  
    // 🔥 Editing is only blocked if:
    // 1. There are active bookings AND
    // 2. The earliest active booking is in the future
    return !(this.flight.hasBookings && latestBookingDate >= today);
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
      this.showErrorDialog('Please fill in all required fields before saving.');
      return;
    }

    if (!this.flight) {
      this.showErrorDialog('Flight is not defined.');
      return;
    }

    if (this.flight.hasBookings) {
      this.flightService.getFlightByNumber(this.flight.flightNumber).then((originalFlight) => {
        if (originalFlight && originalFlight.status !== this.flight!.status) {
          this.showErrorDialog('This flight has active bookings. Status cannot be changed.');
          this.flight!.status = originalFlight.status;
          this.cdr.detectChanges();
          return;
        }

        if (!this.flight) {
          this.showErrorDialog('Flight is not defined.');
          return;
        }
        this.flightService.updateFlight(this.flight).then(() => {
          this.showSuccessDialog('Changes saved successfully!', () => {
            this.router.navigate(['/manage-flight']);
          });
        }).catch((error) => {
          this.showErrorDialog('Failed to save changes. Please try again.');
          console.error('Error saving changes:', error);
        });
      });

      return;
    }

    this.flightService.updateFlight(this.flight).then(() => {
      this.showSuccessDialog('Changes saved successfully!', () => {
        this.router.navigate(['/manage-flight']);
      });
    }).catch((error) => {
      this.showErrorDialog('Failed to save changes. Please try again.');
      console.error('Error saving changes:', error);
    });
  }

  private showErrorDialog(message: string): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'Error', message, showCloseButton: true }
    });
  }

  private showSuccessDialog(message: string, afterClose?: () => void): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'Success', message, showCloseButton: true }
    });

    if (afterClose) {
      dialogRef.afterClosed().subscribe(afterClose);
    }
  }

  resetForm(flightNumber: string): void {
    this.flight = new Flight(
      flightNumber,
      '',
      '',
      new Date(),
      '',
      new Date(),
      '',
      0,
      '',
      0,
      false,
      FlightStatus.Active,
      false,
    );

    if (!this.origin || !this.destination) {
      this.destinationsService.getAllDestinations().then((destinations) => {
        const destinationNames = destinations.map((dest) => dest.destinationName);
        this.origin = destinationNames;
        this.destination = destinationNames;
      });
    }

    this.cdr.detectChanges();
  }
}
