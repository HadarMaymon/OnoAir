import { Component, OnInit } from '@angular/core';
import { BookingsService, Booking } from '../../../service/bookings/bookings.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
})
export class MyBookingsComponent implements OnInit {
  upcomingBookings: Booking[] = [];
  previousBookings: Booking[] = [];

  // Inject Router alongside BookingsService
  constructor(private bookingService: BookingsService, private router: Router) {}

  ngOnInit(): void {
    const now = new Date();
  
    this.bookingService.getAllBookings().subscribe((allBookings: Booking[]) => {
      this.upcomingBookings = allBookings.filter((booking: Booking) => {
        const boardingDate = this.parseDate(booking.boarding);
        return boardingDate > now;
      });
  
      this.previousBookings = allBookings.filter((booking: Booking) => {
        const boardingDate = this.parseDate(booking.boarding);
        return boardingDate <= now;
      });
    });
  }
  
  private parseDate(dateStr: string): Date {
    const [day, month, yearAndTime] = dateStr.split('/');
    const [year, time] = yearAndTime.split(' ');
    const [hours, minutes] = time.split(':');
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));
  }

  // Navigate to booking details with booking ID
  viewBooking(bookingId: string): void {
    this.router.navigate(['/my-bookings-details', bookingId]);
  }
}
