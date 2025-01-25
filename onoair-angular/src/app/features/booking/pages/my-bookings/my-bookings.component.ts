import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../../service/bookings.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Booking } from '../../models/booking';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
  standalone: true,
  imports: [CommonModule, MatButtonModule],
})
export class MyBookingsComponent implements OnInit {
  bookingSections: { title: string; bookings: Booking[] }[] = [];

  constructor(private bookingService: BookingsService, private router: Router) {}

  ngOnInit(): void {
    const now = new Date();
  
    // Ensure static bookings are uploaded only during development
    this.bookingService.uploadStaticBookings()
      .then(() => {
        console.log('Static bookings uploaded successfully!');
      })
      .catch((error) => {
        console.error('Error uploading static bookings:', error);
      });
  
    // Start real-time sync
    this.bookingService.syncBookingsWithImages();
  
    // Subscribe to the real-time bookings observable
    this.bookingService.bookings$.subscribe((allBookings: Booking[]) => {
      console.log('All bookings:', allBookings); // Debug to ensure data is fetched
  
      const upcoming = allBookings.filter((booking) => {
        const boardingDate = this.parseDate(booking.boarding);
        console.log(`Booking ID: ${booking.bookingId}, Boarding Date: ${boardingDate}`); // Debug
        return boardingDate > now;
      });
  
      const previous = allBookings.filter((booking) => {
        const boardingDate = this.parseDate(booking.boarding);
        console.log(`Booking ID: ${booking.bookingId}, Boarding Date: ${boardingDate}`); // Debug
        return boardingDate <= now;
      });
  
      this.bookingSections = [
        { title: 'Upcoming Bookings', bookings: upcoming },
        { title: 'Previous Bookings', bookings: previous },
      ];
    });
  }
  

  private parseDate(dateStr: string): Date {
    if (!dateStr) {
      return new Date(0); // Return a very old date for empty strings
    }

    const [day, month, yearAndTime] = dateStr.split('/');
    const [year, time] = yearAndTime.split(' ');
    const [hours, minutes] = time.split(':');
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));
  }

  viewBooking(bookingId: string): void {
    this.router.navigate(['/my-bookings-details', bookingId]);
  }
}
