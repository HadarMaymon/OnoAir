import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Passenger {
  name: string;
  id: string;
}

export interface Booking {
  bookingId: string;
  origin: string;
  destination: string;
  boarding: string;
  landing: string;
  numberOfPassengers: number;  // Explicit passenger count
  passengers: Passenger[];
  image: string;
  isDynamicDate: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  private bookings: Booking[] = [
    {
      bookingId: 'BK1001',
      origin: 'Tel Aviv',
      destination: 'Berlin',
      boarding: '',
      landing: '',
      numberOfPassengers: 5,
      passengers: [
        { name: 'Hadar Maymon', id: '322334244' },
        { name: 'Ran Bar', id: '312487622' },
        { name: 'Lior Cohen', id: '205678943' },
        { name: 'Noga Levi', id: '309812675' },
        { name: 'Tomer Dahan', id: '305478291' },
      ],
      image: 'assets/destinations/berlin.jpeg',
      isDynamicDate: true,
    },
    {
      bookingId: 'BK1002',
      origin: 'Krakow',
      destination: 'Bora Bora',
      boarding: '16/7/2025 20:00',
      landing: '17/7/2025 01:00',
      numberOfPassengers: 4,
      passengers: [
        { name: 'Hadar Maymon', id: '322334244' },
        { name: 'Ran Bar', id: '312487622' },
        { name: 'Maya Azulay', id: '208754123' },
        { name: 'Tomer Dahan', id: '305478291' },
      ],
      image: 'assets/destinations/bora-bora.jpeg',
      isDynamicDate: false,
    },
    {
      bookingId: 'BK1003',
      origin: 'London',
      destination: 'Dublin',
      boarding: '',
      landing: '',
      numberOfPassengers: 2,
      passengers: [
        { name: 'Hadar Maymon', id: '322334244' },
        { name: 'Ran Bar', id: '312487622' },
      ],
      image: 'assets/destinations/dublin.jpeg',
      isDynamicDate: true,
    },
    {
      bookingId: 'BK1004',
      origin: 'Madrid',
      destination: 'Los Angeles',
      boarding: '20/5/2024 20:00',
      landing: '21/5/2024 02:00',
      numberOfPassengers: 6,
      passengers: [
        { name: 'Hadar Maymon', id: '322334244' },
        { name: 'Ran Bar', id: '312487622' },
        { name: 'Lior Cohen', id: '205678943' },
        { name: 'Maya Azulay', id: '208754123' },
        { name: 'Noga Levi', id: '309812675' },
        { name: 'Elior Ben-Ami', id: '278943512' },
      ],
      image: 'assets/destinations/los-angeles.jpeg',
      isDynamicDate: false,
    },
    {
      bookingId: 'BK1005',
      origin: 'Rome',
      destination: 'New York',
      boarding: '',
      landing: '',
      numberOfPassengers: 3,
      passengers: [
        { name: 'Hadar Maymon', id: '322334244' },
        { name: 'Ran Bar', id: '312487622' },
        { name: 'Noga Levi', id: '309812675' },
      ],
      image: 'assets/destinations/new_york.jpeg',
      isDynamicDate: true,
    },
    {
      bookingId: 'BK1006',
      origin: 'Paris',
      destination: 'Pyongyang',
      boarding: '5/3/2024 15:00',
      landing: '6/3/2024 19:00',
      numberOfPassengers: 1,
      passengers: [
        { name: 'Ofir Shuali', id: '322805359' },
      ],
      image: 'assets/destinations/pyongyang.jpeg',
      isDynamicDate: false,
    },
    {
      bookingId: 'BK1007',
      origin: 'Singapore',
      destination: 'San Francisco',
      boarding: '',
      landing: '',
      numberOfPassengers: 8,
      passengers: [
        { name: 'Hadar Maymon', id: '322334244' },
        { name: 'Ran Bar', id: '312487622' },
        { name: 'Tomer Dahan', id: '305478291' },
        { name: 'Noga Levi', id: '309812675' },
        { name: 'Lior Cohen', id: '205678943' },
        { name: 'Elior Ben-Ami', id: '278943512' },
        { name: 'Maya Azulay', id: '208754123' },
        { name: 'Tomer Dahan', id: '305478291' },
      ],
      image: 'assets/destinations/san francisco.jpeg',
      isDynamicDate: true,
    },
    {
      bookingId: 'BK1008',
      origin: 'Tokyo',
      destination: 'Thailand',
      boarding: '',
      landing: '',
      numberOfPassengers: 4,
      passengers: [
        { name: 'Hadar Maymon', id: '322334244' },
        { name: 'Ran Bar', id: '312487622' },
        { name: 'Lior Cohen', id: '205678943' },
        { name: 'Noga Levi', id: '309812675' },
      ],
      image: 'assets/destinations/thailand.jpeg',
      isDynamicDate: true,
    },
    {
      bookingId: 'BK1009',
      origin: 'Berlin',
      destination: 'Paris',
      boarding: '',
      landing: '',
      numberOfPassengers: 5,
      passengers: [
        { name: 'Hadar Maymon', id: '322334244' },
        { name: 'Ran Bar', id: '312487622' },
        { name: 'Elior Ben-Ami', id: '278943512' },
        { name: 'Maya Azulay', id: '208754123' },
        { name: 'Tomer Dahan', id: '305478291' },
      ],
      image: 'assets/destinations/paris.jpeg',
      isDynamicDate: true,
    },
    {
      bookingId: 'BK1010',
      origin: 'Bangkok',
      destination: 'Tokyo',
      boarding: '',
      landing: '',
      numberOfPassengers: 6,
      passengers: [
        { name: 'Hadar Maymon', id: '322334244' },
        { name: 'Ran Bar', id: '312487622' },
        { name: 'Noga Levi', id: '309812675' },
        { name: 'Lior Cohen', id: '205678943' },
        { name: 'Elior Ben-Ami', id: '278943512' },
        { name: 'Maya Azulay', id: '208754123' },
      ],
      image: 'assets/destinations/tokyo.jpeg',
      isDynamicDate: true,
    },
  ];

  getAllBookings(): Booking[] {
    this.assignDynamicDates();
    return this.bookings;
  }

  getBookingById(bookingId: string): Observable<Booking | undefined> {
    const booking = this.bookings.find(b => b.bookingId === bookingId);
    return of(booking);
  }

  private assignDynamicDates(): void {
    this.bookings.forEach((booking, index) => {
      if (booking.isDynamicDate) {
        booking.boarding = this.getFutureDate(index + 1, 'boarding');
        booking.landing = this.getFutureDate(index + 2, 'landing');
      }
    });
  }

  private getFutureDate(daysToAdd: number, type: string): string {
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);
    const time = type === 'boarding' ? '10:00' : '14:00';
    return `${today.toLocaleDateString('en-GB')} ${time}`;
  }
}
