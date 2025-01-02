import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingsService } from '../../service/bookings.service';
import { MatCardModule } from '@angular/material/card'; 
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Booking } from '../../models/booking';
import { Passenger } from '../../../destinations/models/passenger';

@Component({
  selector: 'app-my-bookings-details',
  templateUrl: './my-bookings-details.component.html',
  styleUrl: './my-bookings-details.component.css',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDividerModule], 
})

export class MyBookingsDetailsComponent implements OnInit {
  booking: Booking | undefined;
  passengers: Passenger[] = [];

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('bookingId');
    if (bookingId) {
      this.bookingService.getBookingById(bookingId).subscribe((booking) => {
        this.booking = booking;
      });
    }
  }

  navigateToBookings(): void {
    this.router.navigate(['/my-bookings']);
  }
}
