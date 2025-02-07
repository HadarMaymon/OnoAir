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

  isLoading = true; // Add this property

  ngOnInit(): void {
    const now = new Date();
  
    // Start real-time sync
    this.bookingService.syncBookingsWithImages();
  
    // Subscribe to the real-time bookings observable
    this.bookingService.bookings$.subscribe({
      next: (allBookings: Booking[]) => {
        console.log('All bookings:', allBookings); // Debug to ensure data is fetched
  
        const upcoming = allBookings.filter((booking) => this.parseDate(booking.boarding) > now);
        const previous = allBookings.filter((booking) => this.parseDate(booking.boarding) <= now);
  
        this.bookingSections = [
          { title: 'Upcoming Bookings', bookings: upcoming },
          { title: 'Previous Bookings', bookings: previous },
        ];
  
        this.isLoading = false; // Stop loading when data is ready
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
  
      // Handle Firestore's YYYY-MM-DD format
      const [year, month, dayAndTime] = dateStr.split('-');
      const [day, time] = dayAndTime?.split(' ') ?? ['01', '00:00']; 
      const [hours, minutes] = time?.split(':') ?? ['00', '00'];
  
      return new Date(
        Number(year),
        Number(month) - 1, // JS Date months are 0-based
        Number(day),
        Number(hours),
        Number(minutes)
      );
    } catch (error) {
      console.error(`Error parsing date: ${dateStr}`, error);
      return new Date(0); // Fallback to a very old date
    }
  }
  

  viewBooking(bookingId: string): void {
    this.router.navigate(['/my-bookings-details', bookingId]);
  }
}
