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
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { DestinationsService } from '../../../destinations/service/destinations.service';
import { ChangeDetectorRef } from '@angular/core';

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
  flight: Flight | undefined;
  flightNumber: string | null = null;
  origin: string[] = [];
  destination: string[] = [];
  minDate: string = new Date().toISOString().split('T')[0]; // Today's date in ISO format

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private destinationsService: DestinationsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const flightNumber = params.get('flightNumber');
  
      // Fetch all destinations
      this.destinationsService.getAllDestinations().then((destinations) => {
        const destinationNames = destinations.map((dest) => dest.destinationName); // Extract destination names
        this.origin = destinationNames;
        this.destination = destinationNames;
  
        console.log('Fetched origin options:', this.origin); // Debug log
        console.log('Fetched destination options:', this.destination); // Debug log
  
        if (flightNumber === 'new') {
          this.resetForm('');
          return;
        }
  
        if (!flightNumber) {
          this.redirectToFlightList();
          return;
        }
  
        if (this.flightNumber !== flightNumber) {
          this.resetForm(flightNumber);
        }
  
        // Fetch flight details if editing an existing flight
        this.flightService.getFlightByNumber(flightNumber).then((flight) => {
          if (flight) {
            // ✅ Convert the string date to a Date object before binding
            flight.date = flight.date ? new Date(flight.date).toISOString().split('T')[0] : '';
            flight.arrivalDate = flight.arrivalDate ? new Date(flight.arrivalDate).toISOString().split('T')[0] : '';
            
            this.flight = flight;
            this.cdr.detectChanges(); // ✅ Ensure Angular detects changes
          }
        });
        
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
      // Format date and arrivalDate
      if (this.flight.date) {
        this.flight.date = new Date(this.flight.date).toISOString().split('T')[0];
      }
      if (this.flight.arrivalDate) {
        this.flight.arrivalDate = new Date(this.flight.arrivalDate).toISOString().split('T')[0];
      }
  
      // Prevent multiple calls by disabling the button temporarily (optional)
      if (this.dialog.openDialogs.length === 0) {
        this.flightService.updateFlight(this.flight).then(() => {
          if (!this.dialog.openDialogs.length) { // Check if no dialog is open
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
          if (!this.dialog.openDialogs.length) { // Prevent duplicate error dialog
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
      false
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
