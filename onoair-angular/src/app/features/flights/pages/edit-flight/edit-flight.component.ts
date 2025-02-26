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
  flightExists: boolean = false; 
  FlightStatus = FlightStatus;
  errorMessage: string = '';
  successMessage: string = '';
  disableOriginDestination: boolean = false;



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
        this.disableOriginDestination = false; // Allow editing when adding a new flight
        return;
      }
  
      this.flightService.getFlightByNumber(this.flightNumber).then((flight) => {
        if (!flight) {
          this.redirectToFlightList();
          return;
        }
  
        this.flight = flight;
        this.flightExists = true;
        this.disableOriginDestination = true; // Prevent editing for existing flights ✅
  
        this.flightService.getFlightBookings(this.flightNumber!).then((hasBookings) => {
          this.flight!.hasBookings = hasBookings;
          this.cdr.detectChanges();
        });
      });
    });
  }
  
  onFlightNumberChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newFlightNumber = inputElement.value.trim();
  
    if (!newFlightNumber) return;
  
    this.flightService.getFlightByNumber(newFlightNumber).then((flight) => {
      if (flight) {
        this.flight = flight;
        this.disableOriginDestination = true; // ✅ Prevent editing for existing flights
      } else {
        this.resetForm(newFlightNumber);
        this.disableOriginDestination = false; // ✅ Allow editing for new flights
      }
    }).catch((error) => {
      console.error('Error fetching flight:', error);
      this.disableOriginDestination = false; // Allow editing in case of error
    });
  }
  
  
  

  validateFlightNumber(event: KeyboardEvent): void {
    const allowedPattern = /^[A-Z0-9]+$/;
    const key = event.key.toUpperCase();
  
    if (!allowedPattern.test(key) && key !== 'Backspace' && key !== 'Tab') {
      event.preventDefault();
    }
  }
  

  

  get isStatusEditingAllowed(): boolean {
    if (!this.flight) return false;
    return this.flight.hasBookings; // Just return the stored value
  }
  
  
  
  validateFlightRoute(): void {
    if (this.flight?.origin === this.flight?.destination) {
      this.errorMessage = 'Origin and Destination must be different!';
    } else {
      this.errorMessage = '';
    }
  }
  
  
  
  
  redirectToFlightList(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { type: 'error', name: 'Flight not found. Redirecting to Manage Flight.' },
    });
  
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/manage-flight']);
    });
  }
  

  saveChanges(flightForm: any): void {
    this.errorMessage = ''; // Clear previous error message
  
    if (flightForm.invalid) {
      this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: { type: 'error', name: 'Please fill in all required fields before saving.' },
      });
      return;
    }
  
    if (!this.flight) {
      this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: { type: 'error', name: 'Flight data is missing. Please try again.' },
      });
      return;
    }
  
    if (this.flight.origin === this.flight.destination) {
      this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: { type: 'error', name: 'Origin and destination must be different.' },
      });
      return;
    }
  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { type: this.flightNumber === 'new' ? 'save' : 'update', name: this.flight.flightNumber },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.confirmed) {
        this.flightService.getFlightByNumber(this.flight!.flightNumber).then((existingFlight) => {
          if (existingFlight) {
            // ✅ Flight exists → Update it
            this.flightService.updateFlight(this.flight!).then(() => {
              this.dialog.open(ConfirmDialogComponent, {
                width: '350px',
                data: { type: 'success', name: `Flight ${this.flight!.flightNumber} has been updated successfully!` },
              }).afterClosed().subscribe(() => {
                this.router.navigate(['/manage-flight']);
              });
            }).catch((error) => {
              console.error('Error updating flight:', error);
              this.dialog.open(ConfirmDialogComponent, {
                width: '350px',
                data: { type: 'error', name: `Failed to update flight: ${error.message}` },
              });
            });
          } else {
            // ✅ Flight does not exist → Add new flight
            this.flightService.addFlight(this.flight!).then(() => {
              this.dialog.open(ConfirmDialogComponent, {
                width: '350px',
                data: { type: 'success', name: `Flight ${this.flight!.flightNumber} has been added successfully!` },
              }).afterClosed().subscribe(() => {
                this.router.navigate(['/manage-flight']);
              });
            }).catch((error) => {
              console.error('Error adding flight:', error);
              this.dialog.open(ConfirmDialogComponent, {
                width: '350px',
                data: { type: 'error', name: `Failed to add flight: ${error.message}` },
              });
            });
          }
        }).catch((error) => {
          console.error('Error checking flight existence:', error);
        });
      }
    });
  }
  
  
  private updateFlight(): void {
    if (!this.flight) {
      this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: { type: 'error', name: 'Flight data is missing.' },
      });
      return;
    }
  
    // Prevent changing status, origin, and destination if active bookings exist
    if (this.flight.hasBookings) {
      this.flightService.getFlightByNumber(this.flight.flightNumber).then((originalFlight) => {
        if (originalFlight) {
          if (
            originalFlight.status !== this.flight!.status ||
            originalFlight.origin !== this.flight!.origin ||
            originalFlight.destination !== this.flight!.destination
          ) {
            this.flight!.status = originalFlight.status;
            this.flight!.origin = originalFlight.origin;
            this.flight!.destination = originalFlight.destination;
            this.cdr.detectChanges();
  
            this.dialog.open(ConfirmDialogComponent, {
              width: '350px',
              data: { type: 'error', name: 'Cannot change status, origin, or destination for a flight with active bookings.' },
            });
            return;
          }
        }
      });
    }
  
    // Proceed with updating the flight and its associated bookings
    this.flightService.updateFlight(this.flight).then(() => {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: { type: 'success', name: `${this.flight!.flightNumber} and its bookings have been updated successfully!` },
      });
  
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['/manage-flight']);
      });
    }).catch((error) => {
      console.error('Error updating flight:', error);
      this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: { type: 'error', name: `Failed to update flight: ${error.message}` },
      });
    });
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
