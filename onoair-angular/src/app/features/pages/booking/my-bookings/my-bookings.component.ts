import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../../../service/bookings/bookings.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Booking } from '../../../models/booking';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
})
export class MyBookingsComponent implements OnInit {
  bookingSections: { title: string; bookings: Booking[] }[] = [];

  constructor(private bookingService: BookingsService, private router: Router) {}

  ngOnInit(): void {
    const now = new Date();

    this.bookingService.getAllBookings().subscribe((allBookings: Booking[]) => {
      const upcoming = allBookings.filter(booking => this.parseDate(booking.boarding) > now);
      const previous = allBookings.filter(booking => this.parseDate(booking.boarding) <= now);

      this.bookingSections = [
        { title: 'Upcoming Bookings', bookings: upcoming },
        { title: 'Previous Bookings', bookings: previous }
      ];
    });
  }

  private parseDate(dateStr: string): Date {
    const [day, month, yearAndTime] = dateStr.split('/');
    const [year, time] = yearAndTime.split(' ');
    const [hours, minutes] = time.split(':');
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));
  }

  viewBooking(bookingId: string): void {
    this.router.navigate(['/my-bookings-details', bookingId]);
  }
}
