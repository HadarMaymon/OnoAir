import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
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
    @Input() destination?: Destination; // 👈 Parent can still pass data
    destinationForm!: FormGroup;
    destinationStatus = DestinationStatus;
    originalIATA: string | null = null;
    isEditMode = false;
  
    constructor(
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private destinationService: DestinationsService,
      private router: Router,
      private dialog: MatDialog
    ) {}
  
    ngOnInit(): void {
      this.originalIATA = this.route.snapshot.paramMap.get('IATA');
  
      if (!this.destination) {
        // 👇 If @Input() is not provided, use the navigation state
        this.destination = history.state.destination;
      }
  
      if (this.originalIATA) {
        this.isEditMode = true;
        if (this.destination) {
          console.log('📡 Using @Input() Destination:', this.destination);
          this.initForm(this.destination);
        } else {
          console.log('📡 Fetching Destination from Firestore:', this.originalIATA);
          this.fetchDestination(this.originalIATA);
        }
      } else {
        console.log('🆕 Creating New Destination');
        this.initForm(this.getEmptyDestination());
      }
    }
  
    private fetchDestination(IATA: string): void {
      this.destinationService.getDestinationByIATA(IATA).then((data) => {
        if (data) {
          console.log(' Destination Fetched:', data);
          this.initForm(data);
        } else {
          console.log('Destination not found, redirecting...');
          this.router.navigate(['/manage-destinations']);
        }
      }).catch((error) => {
        console.error('⚠️ Error fetching destination:', error);
      });
    }
  
    private initForm(destination: Destination): void {
      this.destinationForm = this.fb.group({
        destinationName: [destination.destinationName, [Validators.required]],
        airportName: [destination.airportName, [Validators.required]],
        airportWebsite: [destination.airportWebsite, [Validators.required, Validators.pattern(/https?:\/\/.+/)]],
        IATA: [destination.IATA, [Validators.required]],
        timeZone: [destination.timeZone, [Validators.required]],
        currency: [destination.currency, [Validators.required]],
        image: [destination.image, [Validators.required]],
        status: [destination.status, [Validators.required]],
      });
  
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
      };
    }
  
    saveChanges(): void {
      if (this.destinationForm.invalid) {
        this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: { title: 'Error', message: 'Please fill in all required fields.' },
        });
        return;
      }
  
      const destinationData: Destination = {
        ...this.destinationForm.getRawValue(),
        IATA: this.originalIATA || this.destinationForm.get('IATA')?.value,
      };
  
      if (this.isEditMode) {
        this.updateDestination(destinationData);
      } else {
        this.addDestination(destinationData);
      }
    }
  
    private updateDestination(destination: Destination): void {
      this.destinationService.updateDestination(destination).then(() => {
        console.log('✅ Destination updated:', destination);
        this.router.navigate(['/manage-destinations']);
      }).catch((error) => {
        console.error('❌ Error updating destination:', error);
      });
    }
  
    private addDestination(destination: Destination): void {
      this.destinationService.addDestination(destination).then(() => {
        console.log('✅ Destination added:', destination);
        this.router.navigate(['/manage-destinations']);
      }).catch((error) => {
        console.error('❌ Error adding destination:', error);
      });
    }
  }
  