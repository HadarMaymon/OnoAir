import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { BookingsService } from '../../service/bookings/bookings.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Booking } from '../../models/booking';
import { BookingStatus } from '../../models/booking-status.enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
  standalone: true,
  imports: [CommonModule, MatButtonModule],
})
export class MyBookingsComponent implements OnInit {
  bookingSections: { title: string; bookings: Booking[] }[] = [];
  bookingStatus = BookingStatus; 
  isLoading = true;
  now: Date = new Date(); 

  constructor(private bookingService: BookingsService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.bookingService.syncBookingsWithImages();
    this.bookingService.bookings$.subscribe({
      next: (allBookings: Booking[]) => {
        console.log('Bookings received in MyBookingsComponent:', allBookings);

        const upcoming: Booking[] = [];
        const previous: Booking[] = [];
        const now = new Date();

        allBookings.forEach((booking) => {
          const boardingDate = booking.boarding instanceof Timestamp ? booking.boarding.toDate() : new Date(booking.boarding);
          if (booking.status === BookingStatus.Canceled) {
            previous.push(booking);
          } else if (boardingDate > now) {
            upcoming.push(booking);
          } else {
            previous.push(booking);
          }
        });

        this.bookingSections = [
          { title: 'Upcoming Bookings', bookings: upcoming },
          { title: 'Previous Bookings', bookings: previous },
        ];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching bookings:', error);
        this.isLoading = false;
      },
    });
  }

  handleImageError(booking: Booking): void {
    console.error(`Error loading image: ${booking.image} for Flight ${booking.flightNumber}`);
  
    // Wait 500ms before replacing in case it's a temporary issue
    setTimeout(() => {
      if (booking.image?.startsWith('http')) {
        console.warn(`Skipping fallback for valid image URL: ${booking.image}`);
      } else {
        console.warn(`Replacing broken image with default for: ${booking.flightNumber}`);
        booking.image = 'assets/onoairLogo.png';
      }
    }, 500);
    console.log(`Fetched image for ${booking.flightNumber}:`, booking.image);

  }
  
  

  viewBooking(bookingId: string): void {
    this.router.navigate(['/my-bookings-details', bookingId]);
  }

  toggleBookingStatus(booking: Booking): void {
    if (booking.status === BookingStatus.Canceled) {
      this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: { type: 'error', name: 'This booking is already canceled and cannot be reactivated.', showCloseButton: true },
      });
      return;
    }
  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        type: 'cancel', 
        showConfirmButton: true,
        showCancelButton: true,
      },
    });
  
    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      if (result?.confirmed) {
        this.bookingService.updateBookingStatus(booking.bookingId, BookingStatus.Canceled)
          .then(() => {
            booking.status = BookingStatus.Canceled;
            this.moveBookingToCorrectSection(booking);
  
            this.dialog.open(ConfirmDialogComponent, {
              width: '350px',
              data: { type: 'success', name: 'Booking has been successfully canceled.', showCloseButton: true },
            });
          })
          .catch((error) => {
            this.dialog.open(ConfirmDialogComponent, {
              width: '350px',
              data: { type: 'error', name: 'Failed to cancel the booking. Please try again.', showCloseButton: true },
            });
            console.error('Error canceling booking:', error);
          });
      }
    });
  }
  

  isTimestamp(value: any): boolean {
    return value instanceof Timestamp;
}

isFutureDate(date: any): boolean {
  const parsedDate = date instanceof Timestamp ? date.toDate() : new Date(date);
  return parsedDate > new Date(); // Compare with current time
}


  private moveBookingToCorrectSection(updatedBooking: Booking): void {
    this.bookingSections.forEach(section => {
      section.bookings = section.bookings.filter(b => b.bookingId !== updatedBooking.bookingId);
    });

    const now = new Date();
    const boardingDate = updatedBooking.boarding instanceof Timestamp ? updatedBooking.boarding.toDate() : new Date(updatedBooking.boarding);

    if (updatedBooking.status === BookingStatus.Canceled) {
      this.bookingSections.find(section => section.title === 'Previous Bookings')?.bookings.push(updatedBooking);
    } else if (boardingDate > now) {
      this.bookingSections.find(section => section.title === 'Upcoming Bookings')?.bookings.push(updatedBooking);
    } else {
      this.bookingSections.find(section => section.title === 'Previous Bookings')?.bookings.push(updatedBooking);
    }
  }
  formatDate(date: any): Date {
    return date instanceof Timestamp ? date.toDate() : date;
  }
}
