import { Component, OnInit } from '@angular/core';
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
  destinationForm!: FormGroup;
  originalIATA: string | null = null; 
  destinationStatus = DestinationStatus;

  constructor(
    private route: ActivatedRoute,
    private destinationService: DestinationsService,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.originalIATA = this.route.snapshot.paramMap.get('IATA');
  
    if (this.originalIATA) {
      // Fetch the destination by IATA code
      this.destinationService.getDestinationByIATA(this.originalIATA)
        .then((data: Destination | undefined) => {
          if (data) {
            console.log('📡 Destination Data:', data); // Debugging log
            this.initForm(data); // ✅ Initialize the form for any valid destination
          } else {
            this.redirectToDestinationList(); // Redirect if destination does not exist
          }
        })
        .catch((error) => {
          console.error('⚠️ Error fetching destination:', error);
          this.redirectToDestinationList(); // Handle fetch errors
        });
    } else {
      // Initialize a blank form for creating a new destination
      this.initForm({
        destinationName: '',
        airportName: '',
        airportWebsite: '',
        IATA: '',
        timeZone: '',
        currency: '',
        image: '',
        status: DestinationStatus.Active, // Default to Active for new destinations
      } as Destination);
    }
  }
  
      

  initForm(destination: Destination): void {
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
  
    if (this.originalIATA) {
      this.destinationForm.get('IATA')?.disable();
    }
  }
  
  
  

  redirectToDestinationList(): void {
    alert('Destination not found. Redirecting to Manage Destinations.');
    this.router.navigate(['/manage-destinations']);
  }

  saveChanges(): void {
    if (this.destinationForm.invalid) {
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
  
    const destinationData: Destination = {
      ...this.destinationForm.getRawValue(),
      IATA: this.originalIATA!, // Preserve original IATA
    };
  
    if (this.originalIATA) {
      // Update existing destination
      this.destinationService.updateDestination(destinationData)
        .then(() => {
          this.showSuccessDialog('Destination updated successfully!');
        })
        .catch(() => {
          this.showErrorDialog('Failed to update destination.');
        });
    } else {
      // Add new destination
      if (!destinationData.IATA) {
        this.showErrorDialog('IATA Code is required.');
        return;
      }
  
      this.destinationService.addDestination(destinationData)
        .then(() => {
          this.showSuccessDialog('Destination added successfully!');
        })
        .catch(() => {
          this.showErrorDialog('Failed to add destination.');
        });
    }
  }
      
  private showSuccessDialog(message: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'Success', message },
    });
  
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/manage-destinations']);
    });
  }
  
  private showErrorDialog(message: string): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'Error', message },
    });
  }
      
  deleteDestination(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { name: this.destinationForm.get('IATA')?.value },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        const IATA = this.originalIATA;
        if (IATA) {
          this.destinationService.deleteDestination(IATA).then(() => {
            alert('Destination deleted successfully! Redirecting to Manage Destinations.');
            this.router.navigate(['/manage-destinations']);
          }).catch(() => {
            alert('Failed to delete destination. Please try again.');
          });
        }
      }
    });
  }
}
