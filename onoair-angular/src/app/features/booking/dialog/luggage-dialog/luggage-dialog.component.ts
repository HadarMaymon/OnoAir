import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-luggage-dialog',
  templateUrl: './luggage-dialog.component.html',
  styleUrls: ['./luggage-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class LuggageDialogComponent {
  luggage = { cabin: 0, checked: 0, heavy: 0 };
  maxLuggageItems: number;
  errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<LuggageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.luggage = { ...data.passenger.luggage };
    this.maxLuggageItems = data.maxLuggageItems; 
  }


  /**
   * Calculate total baggage count.
   */
  totalBaggageCount(): number {
    return this.luggage.cabin + this.luggage.checked + this.luggage.heavy;
  }

  validateLuggage(): boolean {
    const totalItems = this.luggage.cabin + this.luggage.checked + this.luggage.heavy;
    if (totalItems > this.maxLuggageItems) {
      this.errorMessage = `Luggage limit exceeded! Max allowed: ${this.maxLuggageItems}`;
      return false;
    }
    this.errorMessage = '';
    return true;
  }


  /**
   * Save the luggage selection.
   */
  saveLuggage(): void {
    if (this.totalBaggageCount() > 9) {
      alert('Total luggage cannot exceed 9 items per passenger.');
      return;
    }
    this.dialogRef.close(this.luggage);
  }
}
