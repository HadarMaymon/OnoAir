import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../../service/bookings.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Booking } from '../../models/booking';
import { BookingStatus } from '../../models/booking-status.enum';

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

  constructor(private bookingService: BookingsService, private router: Router) {}

  ngOnInit(): void {
    const now = new Date();
    this.bookingService.syncBookingsWithImages();
    this.bookingService.bookings$.subscribe({
      next: (allBookings: Booking[]) => {
        // Separate bookings into upcoming and previous
        const upcoming = allBookings.filter(
          (booking) => this.parseDate(booking.boarding) > now
        );
        const previous = allBookings.filter((booking) => this.parseDate(booking.boarding) <= now);
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

  private parseDate(dateStr: string): Date {
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

  cancelBooking(bookingId: string): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(bookingId).catch((error) => {
        console.error('Error canceling booking:', error);
        alert('Failed to cancel the booking. Please try again.');
      });
    }
  }
}
