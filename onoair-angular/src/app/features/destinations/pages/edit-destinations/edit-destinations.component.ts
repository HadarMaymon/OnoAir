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
    this.flightService.testQuery();
    this.originalIATA = this.route.snapshot.paramMap.get('IATA');

    if (!this.destination) {
      this.destination = history.state.destination;
    }

    if (this.originalIATA) {
      this.isEditMode = true;
      if (this.destination) {
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
  
  
    if (!this.isEditingAllowed) {
      this.destinationForm.disable();
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
    // Re-check Firestore for active flights before allowing edit
    this.flightService.getActiveFlightsForDestination(this.destination!.destinationName).then((activeFlights) => {
      this.destination!.hasFutureFlights = activeFlights.length > 0;
  
      if (this.destination?.hasFutureFlights) {  
        this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {
            type: 'error',
            name: 'This destination has active flights and cannot be modified.',
            showCloseButton: true
          },
        });
        return;
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


  get isEditingAllowed(): boolean {
    return !this.destination?.hasFutureFlights; 
  }
}
