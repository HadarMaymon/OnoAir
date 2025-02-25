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

  /**
   * Validate luggage input (no negatives, within limit).
   */
  validateLuggage(): boolean {
    // Ensure baggage values are not negative
    if (this.luggage.cabin < 0) this.luggage.cabin = 0;
    if (this.luggage.checked < 0) this.luggage.checked = 0;
    if (this.luggage.heavy < 0) this.luggage.heavy = 0;

    // Check if baggage count exceeds max limit
    const totalItems = this.totalBaggageCount();
    if (totalItems > this.maxLuggageItems) {
      this.errorMessage = `Luggage limit exceeded! Max allowed: ${this.maxLuggageItems}`;
      return false;
    }
    
    this.errorMessage = ''; // Clear error if validation passes
    return true;
  }

  /**
   * Prevent users from entering negative numbers or scientific notation.
   */
  preventNegativeInput(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }

  /**
   * Save the luggage selection.
   */
  saveLuggage(): void {
    if (!this.validateLuggage()) {
      return;
    }

    this.dialogRef.close(this.luggage);
  }
}
