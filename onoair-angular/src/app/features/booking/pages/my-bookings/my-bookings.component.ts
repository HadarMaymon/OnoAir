import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { BookingsService } from '../../service/bookings.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Booking } from '../../models/booking';
import { BookingStatus } from '../../models/booking-status.enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
  standalone: true,
  imports: [CommonModule, MatButtonModule],
})
export class MyBookingsComponent implements OnInit {
  bookingSections: { title: string; bookings: Booking[] }[] = [];
  bookingStatus = BookingStatus; // Expose the enum to the template
  isLoading = true;
  now: Date = new Date(); // ✅ Current date, exposed to the template

  constructor(private bookingService: BookingsService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    const now = new Date();
  
    this.bookingService.syncBookingsWithImages();
    this.bookingService.bookings$.subscribe({
      next: (allBookings: Booking[]) => {
        // Separate bookings into upcoming and previous
        const upcoming: Booking[] = [];
        const previous: Booking[] = [];
  
        allBookings.forEach((booking) => {
          const boardingDate = this.parseDate(booking.boarding);
  
          if (booking.status === BookingStatus.Canceled) {
            previous.push(booking); // ✅ Always move canceled bookings to "Previous"
          } else if (boardingDate > now) {
            upcoming.push(booking); // ✅ Active + Future -> "Upcoming"
          } else {
            previous.push(booking); // ✅ Active + Past -> "Previous"
          }
        });
  
        // Assign to sections
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

  parseDate(dateStr: string): Date {
    try {
      if (!dateStr) {
        return new Date(0);
      }
      const [year, month, dayAndTime] = dateStr.split('-');
      const [day, time] = dayAndTime?.split(' ') ?? ['01', '00:00'];
      const [hours, minutes] = time?.split(':') ?? ['00', '00'];
      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hours),
        Number(minutes)
      );
    } catch (error) {
      console.error(`Error parsing date: ${dateStr}`, error);
      return new Date(0);
    }
  }

  viewBooking(bookingId: string): void {
    this.router.navigate(['/my-bookings-details', bookingId]);
  }

  toggleBookingStatus(booking: Booking): void {
    if (booking.status === BookingStatus.Canceled) {
      console.warn(`Booking ${booking.bookingId} is already canceled and cannot be reactivated.`);
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        type: 'update',
        title: 'Confirm Cancel',
        message: 'Are you sure you want to cancel this booking?',
        showCancelButton: true,
        showConfirmButton: true,
      },
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      if (result?.confirmed) {
        this.bookingService.updateBookingStatus(booking.bookingId, BookingStatus.Canceled)
          .then(() => {
            booking.status = BookingStatus.Canceled;
            this.moveBookingToCorrectSection(booking);
          })
          .catch((error) => {
            console.error('Error canceling booking:', error);
          });
      }
    });
  }

  private moveBookingToCorrectSection(updatedBooking: Booking): void {
    this.bookingSections.forEach(section => {
      section.bookings = section.bookings.filter(b => b.bookingId !== updatedBooking.bookingId);
    });

    if (updatedBooking.status === BookingStatus.Canceled) {
      this.bookingSections.find(section => section.title === 'Previous Bookings')?.bookings.push(updatedBooking);
    } else {
      const now = new Date();
      if (this.parseDate(updatedBooking.boarding) > now) {
        this.bookingSections.find(section => section.title === 'Upcoming Bookings')?.bookings.push(updatedBooking);
      } else {
        this.bookingSections.find(section => section.title === 'Previous Bookings')?.bookings.push(updatedBooking);
      }
    }
  }
}
