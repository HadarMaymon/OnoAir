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
import { ChangeDetectorRef } from '@angular/core';
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
  arrivalTime: string[] = [];

  minDate: string = new Date().toISOString().split('T')[0]; // Today's date in ISO format


  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
    
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const flightNumber = params.get('flightNumber');
  
      if (!flightNumber) {
        this.redirectToFlightList();
        return;
      }
  
      // ✅ If flight number changes, reset form
      if (this.flightNumber !== flightNumber) {
        this.resetForm(flightNumber);
      }
  
      this.flightService.getOrigins().then((data) => {
        this.origin = data;
      });
  
      this.flightService.getDestinations().then((data) => {
        this.destination = data;
      });
  
      this.flightService.getFlightByNumber(flightNumber).then((flight) => {
        if (flight) {
          this.flight = flight;
        }
      });
  
      this.cdr.detectChanges(); // ✅ Ensure UI refresh
    });
  }
  
  
  onFlightNumberChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newFlightNumber = inputElement.value.trim(); // Remove extra spaces
  
    if (!newFlightNumber) return; // Ignore empty input
  
    // ✅ Check if the flight exists in Firestore
    this.flightService.getFlightByNumber(newFlightNumber).then((flight) => {
      if (flight) {
        this.flight = flight; // ✅ Flight exists, load data
      } else {
        this.resetForm(newFlightNumber); // ✅ Flight does NOT exist, reset form
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


  validateDates(): void {
    if (this.flight?.date && this.flight?.arrivalDate) {
      const departureDate = new Date(this.flight.date);
      const arrivalDate = new Date(this.flight.arrivalDate);
  
      if (arrivalDate < departureDate) {
        this.flight.arrivalDate = ''; // Reset invalid date
      }
    }
    this.calculateDuration(); // Always calculate after validation
  }
  
  validateTimes(): void {
    if (this.flight?.departureTime && this.flight?.arrivalTime) {
      const [depHours, depMinutes] = this.flight.departureTime.split(':').map(Number);
      const [arrHours, arrMinutes] = this.flight.arrivalTime.split(':').map(Number);
  
      const departureTime = new Date();
      const arrivalTime = new Date();
  
      departureTime.setHours(depHours, depMinutes);
      arrivalTime.setHours(arrHours, arrMinutes);
  
      if (arrivalTime <= departureTime) {
        this.flight.arrivalTime = ''; 
      }
    }
    this.calculateDuration();
  }
    
  
  
  calculateDuration(): void {
    console.log('calculateDuration called');
    if (this.flight?.departureTime && this.flight?.arrivalTime && this.flight?.date && this.flight?.arrivalDate) {
      const departureDateTime = new Date(`${this.flight.date}T${this.flight.departureTime}`);
      const arrivalDateTime = new Date(`${this.flight.arrivalDate}T${this.flight.arrivalTime}`);
  
      if (arrivalDateTime > departureDateTime) {
        const diffMs = arrivalDateTime.getTime() - departureDateTime.getTime(); // Difference in milliseconds
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60)); // Convert to hours
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // Get remaining minutes
  
        this.flight = {
          ...this.flight,
          duration: `${diffHours}h ${diffMinutes}m`,
          updatePrice: () => {},
          updateSeats: () => {},
          assignDynamicDate: () => {},
        };
        console.log(`Duration updated to: ${this.flight.duration}`);
        this.cdr.detectChanges(); // Ensure UI updates
      } else {
        this.flight.duration = ''; // Reset duration if invalid
        console.warn('Invalid date/time combination for duration calculation.');
      }
    } else {
      console.warn('Insufficient data for duration calculation.');
    }
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

  resetForm(flightNumber: string): void {
    this.flight = new Flight(
      flightNumber,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      0,
      '', // image
      0,
      false
    
    );
    this.flightNumber = flightNumber;
    this.cdr.detectChanges(); // ✅ Ensure UI updates  
  }
}
