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
  ],
  standalone: true,
})
export class EditDestinationsComponent implements OnInit {
  destinationForm!: FormGroup;
  originalIATA: string | null = null; // Use IATA as a unique identifier

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
      this.destinationService.getDestinationByIATA(this.originalIATA)
        .then((data: Destination | undefined) => {
          if (data) {
            console.log('📡 Destination Data:', data); // Debugging log
            this.initForm(data);
          } else {
            this.redirectToDestinationList();
          }
        })
        .catch((error) => {
          console.error('⚠️ Error fetching destination:', error);
          this.redirectToDestinationList();
        });
    } else {
      this.redirectToDestinationList();
    }
  }
  
  

  initForm(destination: Destination): void {
    this.destinationForm = this.fb.group({
      destinationName: [destination.destinationName, [Validators.required]],  
      airportName: [destination.airportName, [Validators.required]],          
      airportWebsite: [destination.airportWebsite, [Validators.required, Validators.pattern(/https?:\/\/.+/)]],
      IATA: [{ value: destination.IATA, disabled: true }],
      timeZone: [destination.timeZone, [Validators.required]],
      currency: [destination.currency, [Validators.required]],
      image: [destination.image, [Validators.required]],
    });
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
  
    const updatedDestination: Destination = {
      ...this.destinationForm.getRawValue(),
      IATA: this.originalIATA, 
    };
  
    this.destinationService.updateDestination(updatedDestination)
      .then(() => {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {
            title: 'Success',
            message: 'Destination updated successfully!',
          },
        });
  
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/manage-destinations']);
        });
      })
      .catch((error) => {
        this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {
            title: 'Error',
            message: 'Failed to update destination. Please try again.',
          },
        });
        console.error('Error updating destination:', error);
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
