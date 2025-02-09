import { Component, Input, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
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
import { MatOptionModule } from '@angular/material/core';
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
    MatSelectModule,
    MatOptionModule,
  ],
})
export class EditFlightComponent implements OnInit {
  
  @Input() flightNumber: string | null = null;
  flight: Flight | undefined;
  origin: string[] = [];
  destination: string[] = [];
  minDate: string = new Date().toISOString().split('T')[0]; 

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

    // Fetch all destinations
    this.destinationsService.getAllDestinations().then((destinations) => {
      const destinationNames = destinations.map((dest) => dest.destinationName);
      this.origin = destinationNames;
      this.destination = destinationNames;

      console.log('Fetched origin options:', this.origin); 
      console.log('Fetched destination options:', this.destination); 

      if (!this.flightNumber) {
        this.redirectToFlightList();
        return;
      }

      if (this.flightNumber === 'new') {
        this.resetForm('');
        return;
      }

      this.flightService.getFlightByNumber(this.flightNumber).then((flight) => {
        if (flight) {
          if (flight.date) {
            const date = new Date(flight.date);
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); 
            flight.date = date.toISOString().split('T')[0]; 
          }

          if (flight.arrivalDate) {
            const arrivalDate = new Date(flight.arrivalDate);
            arrivalDate.setMinutes(arrivalDate.getMinutes() - arrivalDate.getTimezoneOffset()); 
            flight.arrivalDate = arrivalDate.toISOString().split('T')[0];
            flight.status = flight.status as FlightStatus || FlightStatus.Active;
          }

          this.flight = flight;
          this.cdr.detectChanges();
        }
      });
    });
  }
  

  validateFlightNumber(event: KeyboardEvent): void {
    const allowedPattern = /^[A-Za-z0-9]+$/;
    const key = event.key;
  
    if (!allowedPattern.test(key) && key !== 'Backspace' && key !== 'Tab') {
      event.preventDefault(); // Prevents invalid characters from being entered
    }
  }
  
        
      
  
  onFlightNumberChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newFlightNumber = inputElement.value.trim(); // Remove extra spaces

    if (!newFlightNumber) return; // Ignore empty input

    // Check if the flight exists in Firestore
    this.flightService.getFlightByNumber(newFlightNumber).then((flight) => {
      if (flight) {
        this.flight = flight; // Flight exists, load data
      } else {
        this.resetForm(newFlightNumber); // Flight does NOT exist, reset form
      }
    }).catch((error) => {
      console.error('Error fetching flight:', error);
      this.resetForm(newFlightNumber); // Reset form on error
    });
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
      if (!this.dialog.openDialogs.length) {  // Ensure no existing dialog is open
        this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {
            title: 'Error',
            message: 'Please fill in all required fields before saving.',
          },
        });
      }
      return;
    }
  
    if (this.flight) {
      // Fix date issue: Convert to local time zone before saving
      if (this.flight.date) {
        const selectedDate = new Date(this.flight.date);
        selectedDate.setMinutes(selectedDate.getMinutes() - selectedDate.getTimezoneOffset()); // Adjust for local timezone
        this.flight.date = selectedDate.toISOString().split('T')[0]; // Store in YYYY-MM-DD format
      }
  
      if (this.flight.arrivalDate) {
        const arrivalDate = new Date(this.flight.arrivalDate);
        arrivalDate.setMinutes(arrivalDate.getMinutes() - arrivalDate.getTimezoneOffset());
        this.flight.arrivalDate = arrivalDate.toISOString().split('T')[0];
      }
  
      this.flightService.updateFlight(this.flight).then(() => {
        if (!this.dialog.openDialogs.length) {
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
        }
      }).catch((error) => {
        if (!this.dialog.openDialogs.length) {
          this.dialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: {
              title: 'Error',
              message: 'Failed to save changes. Please try again.',
            },
          });
        }
        console.error('Error saving changes:', error);
      });
    }
  }
  
  

  resetForm(flightNumber: string): void {
    this.flight = new Flight(
      flightNumber,
      '',
      '',
      '',
      '',
      '',
      '',
      0,
      '',
      0,
      false,
      FlightStatus.Active 
    );
    this.flightNumber = flightNumber;
  
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
