import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestinationsService } from '../../service/destinations.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Destination } from '../../models/destination';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { DestinationStatus } from '../../models/destination-status.enum';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FlightService } from '../../../flights/service/flights.service';

@Component({
  selector: 'app-edit-destinations',
  templateUrl: './edit-destinations.component.html',
  styleUrls: ['./edit-destinations.component.css'],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule
  ],
  standalone: true,
})

export class EditDestinationsComponent implements OnInit {
  @Input() destination?: Destination; 
  destinationForm!: FormGroup;
  destinationStatus = DestinationStatus;
  originalIATA: string | null = null;
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private destinationService: DestinationsService,
    private router: Router,
    private dialog: MatDialog,
    private flightService: FlightService
  ) {}

  private async fetchDestination(IATA: string): Promise<void> {
    try {
      const data = await this.destinationService.getDestinationByIATA(IATA);
      
      if (!data) {
        this.router.navigate(['/manage-destinations']);
        return;
      }
  
  
      const activeFlights = await this.flightService.getActiveFlightsForDestination(data.destinationName);
    
      const hasActiveFlights = activeFlights.length > 0;
  
      this.destination = {
        ...data,
        hasFutureFlights: hasActiveFlights
      };
  
  
      setTimeout(() => {
        if (this.destination) {
          this.initForm(this.destination);
        }
      }, 0);  
  
    } catch (error) {
      console.error(' Error fetching destination:', error);
    }
  }
  

  ngOnInit(): void {
    this.originalIATA = this.route.snapshot.paramMap.get('IATA');
  
    if (!this.destination) {
      this.destination = history.state.destination ?? this.getEmptyDestination();
    }
  
    if (this.originalIATA) {
      this.isEditMode = true;
      if (this.destination?.destinationName) {
        this.initForm(this.destination);
      } else {
        this.fetchDestination(this.originalIATA);
      }
    } else {
      this.initForm(this.getEmptyDestination());
    }
  }
  
  

  private initForm(destination: Destination): void {
    this.destinationForm = this.fb.group({
      destinationName: [destination.destinationName, [Validators.required, Validators.minLength(2)]],
      airportName: [destination.airportName, [Validators.required, Validators.minLength(2)]],
      airportWebsite: [destination.airportWebsite, [Validators.required, Validators.pattern(/https?:\/\/.+/)]],
      IATA: [destination.IATA, [Validators.required, Validators.pattern(/^[A-Z]{3}$/)]],
      timeZone: [destination.timeZone, [Validators.required]],
      currency: [destination.currency, [Validators.required, Validators.pattern(/^[A-Z]{3}$/)]],
      image: [destination.image, [Validators.required, Validators.pattern(/https?:\/\/.+/)]],
      status: [{ value: destination.status, disabled: destination.hasFutureFlights }, [Validators.required]],
    });
  
    // ✅ Explicitly disable IATA if editing an existing destination
    if (this.isEditMode) {
      this.destinationForm.get('IATA')?.disable();
    }
  }
  
  
  
  private getEmptyDestination(): Destination {
    return {
      destinationName: '',
      airportName: '',
      airportWebsite: '',
      IATA: '',
      timeZone: '',
      currency: '',
      image: '',
      status: DestinationStatus.Active,
      hasFutureFlights: false,
      nextFlightDate: null
    };
  }

  saveChanges(): void {  
    if (!this.destination) {
      console.error("❌ No destination data available.");
      this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: { type: 'error', name: 'No destination data found. Please refresh and try again.' },
      });
      return;
    }
  
    this.flightService.getActiveFlightsForDestination(this.destination.destinationName).then((activeFlights) => {
      this.destination!.hasFutureFlights = activeFlights.length > 0;
  
      if (this.destination?.hasFutureFlights) {  
        const currentStatus = this.destinationForm.get('status')?.value;
        const originalStatus = this.destination?.status;
  
        if (currentStatus !== originalStatus) {
          // 🚫 User tried to change the status! Show error dialog
          this.destinationForm.get('status')?.setValue(originalStatus); // ✅ Revert status
          this.dialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: { type: 'error', name: 'This destination has active flights. Status cannot be changed.' },
          });
          return;
        }
      }
  
      if (this.destinationForm.invalid) {
        console.warn('Form validation failed. Cannot proceed.');
        this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: { type: 'error', name: 'Please fill in all required fields correctly' },
        });
        return;
      }
  
      const destinationData: Destination = {
        ...this.destinationForm.getRawValue(),
        IATA: this.originalIATA || this.destinationForm.get('IATA')?.value,
        status: this.destination?.hasFutureFlights ? this.destination?.status : this.destinationForm.get('status')?.value, // ✅ Lock status if needed
      };
  
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: {
          type: this.isEditMode ? 'update' : 'save',
          name: destinationData.destinationName,
        },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result?.confirmed) {
          if (this.isEditMode) {
            this.updateDestination(destinationData);
          } else {
            this.addDestination(destinationData);
          }
        }
      });
    });
  }
  

  private updateDestination(destination: Destination): void {
    if (this.destination?.hasFutureFlights) {
      this.destinationForm.get('status')?.setValue(this.destination?.status); 
    }
  
    this.destinationService.updateDestination(destination).then(() => {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: {
          type: 'success',
          name: `${destination.destinationName} has been updated successfully!`,
        },
      });
  
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['/manage-destinations']);
      });
  
    }).catch((error) => {
      console.error('Error updating destination:', error);
    });
  }
  

  private addDestination(destination: Destination): void {
    this.destinationService.addDestination(destination).then(() => {

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: {
          type: 'success',
          name: `${destination.destinationName} has been added successfully!`,
        },
      });

      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['/manage-destinations']);
      });

    }).catch((error) => {
      console.error('Error adding destination:', error);
    });
  }


  get isStatusEditingAllowed(): boolean {
    return !(this.destination?.hasFutureFlights);
  }
  
}
