import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; 

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  styleUrls: ['./confirm-dialog.component.css'],
  encapsulation: ViewEncapsulation.None, // Allow global styles to apply
  imports: [MatDialogContent, MatDialogActions, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ getTitle() }}</h2>
    <mat-dialog-content>
      <p>{{ getMessage() }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">No</button>
      <button mat-button [color]="getConfirmButtonColor()" (click)="onConfirm()">{{ getConfirmButtonText() }}</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: string; name: string }
  ) {}

  getTitle(): string {
    switch (this.data.type) {
      case 'delete':
        return 'Confirm Delete';
      case 'save':
        return 'Confirm Save';
      case 'update':
        return 'Confirm Update';
      case 'error':
        return 'Error';
      case 'success':
        return 'Success';
      case 'cancel':
        return 'Cancel';
      case 'booking':
        return 'Confirm Booking';
      default:
        return 'Default Confirm';
    }
  }

  getMessage(): string {
    const targetName = this.data.name || 'this item';
    switch (this.data.type) {
      case 'delete':
        return `Are you sure you want to delete ${targetName}?`;
      case 'save':
        return `Are you sure you want to save changes to ${targetName}?`;
      case 'booking':
        return `Are you sure you want to book this order?`;
      case 'update':
        return `Are you sure you want to update ${targetName}?`;
      case 'error':
        return 'An error occurred while processing your request. Please check your form.';
      case 'success':
        return 'Your request was processed successfully.';
      case 'cancel':
        return 'Are you sure you want to cancel?';
      default:
        return 'Default message!';
    }
  }

  getConfirmButtonText(): string {
    switch (this.data.type) {
      case 'delete':
        return 'Delete';
      case 'save':
        return 'Save';
      case 'update':
        return 'Update';
      case 'error':
        return 'Close';
      case 'success':
        return 'Close';
      case 'cancel':
        return 'Cancel';
      case 'booking':
        return 'Book';
      default:
        return 'Confirm';
    }
  }

  getConfirmButtonColor(): string {
    switch (this.data.type) {
      case 'delete':
        return 'warn';
      case 'save':
        return 'primary';
      case 'update':
        return 'accent';
      case 'error':
        return 'warn';
      case 'success':
        return 'primary';
      case 'cancel':
        return 'warn';
      default:
        return 'default';
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close({ confirmed: true, action: this.data.type });
  }
}