import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DestinationsService } from '../destinations/destinations.service';
import { forkJoin } from 'rxjs';
import { Booking, Passenger } from '../../models/booking';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  private bookings: Booking[] = [
    new Booking(
      'BK1001',
      'Tel Aviv',
      'Berlin',
      '',
      '',
      5,
      [
        new Passenger('Hadar Maymon', '322334244'),
        new Passenger('Ran Bar', '312487622'),
        new Passenger('Lior Cohen', '205678943'),
        new Passenger('Noga Levi', '309812675'),
        new Passenger('Tomer Dahan', '305478291')
      ],
      '',
      true
    ),
    new Booking(
      'BK1002',
      'Krakow',
      'Bora Bora',
      '16/7/2025 20:00',
      '17/7/2025 01:00',
      4,
      [
        new Passenger('Hadar Maymon', '322334244'),
        new Passenger('Ran Bar', '312487622'),
        new Passenger('Maya Azulay', '208754123'),
        new Passenger('Tomer Dahan', '305478291')
      ],
      '',
      false
    ),
    new Booking(
      'BK1003',
      'London',
      'Dublin',
      '',
      '',
      2,
      [
        new Passenger('Hadar Maymon', '322334244'),
        new Passenger('Ran Bar', '312487622')
      ],
      '',
      true
    ),
    new Booking(
      'BK1004',
      'Madrid',
      'Los Angeles',
      '20/5/2024 20:00',
      '21/5/2024 02:00',
      6,
      [
        new Passenger('Hadar Maymon', '322334244'),
        new Passenger('Ran Bar', '312487622'),
        new Passenger('Lior Cohen', '205678943'),
        new Passenger('Maya Azulay', '208754123'),
        new Passenger('Noga Levi', '309812675'),
        new Passenger('Elior Ben-Ami', '278943512')
      ],
      '',
      false
    ),
    new Booking(
      'BK1005',
      'Rome',
      'New York',
      '',
      '',
      3,
      [
        new Passenger('Hadar Maymon', '322334244'),
        new Passenger('Ran Bar', '312487622'),
        new Passenger('Noga Levi', '309812675')
      ],
      '',
      true
    ),
    new Booking(
      'BK1006',
      'Paris',
      'Pyongyang',
      '5/3/2024 15:00',
      '6/3/2024 19:00',
      1,
      [
        new Passenger('Ofir Shuali', '322805359')
      ],
      '',
      false
    ),
    new Booking(
      'BK1007',
      'Singapore',
      'San Francisco',
      '',
      '',
      8,
      [
        new Passenger('Hadar Maymon', '322334244'),
        new Passenger('Ran Bar', '312487622'),
        new Passenger('Tomer Dahan', '305478291'),
        new Passenger('Noga Levi', '309812675'),
        new Passenger('Lior Cohen', '205678943'),
        new Passenger('Elior Ben-Ami', '278943512'),
        new Passenger('Maya Azulay', '208754123'),
        new Passenger('Tomer Dahan', '305478291')
      ],
      '',
      true
    ),
    new Booking(
      'BK1008',
      'Tokyo',
      'Bangkok',
      '',
      '',
      4,
      [
        new Passenger('Hadar Maymon', '322334244'),
        new Passenger('Ran Bar', '312487622'),
        new Passenger('Lior Cohen', '205678943'),
        new Passenger('Noga Levi', '309812675')
      ],
      '',
      true
    ),
    new Booking(
      'BK1009',
      'Berlin',
      'Paris',
      '',
      '',
      5,
      [
        new Passenger('Hadar Maymon', '322334244'),
        new Passenger('Ran Bar', '312487622'),
        new Passenger('Elior Ben-Ami', '278943512'),
        new Passenger('Maya Azulay', '208754123'),
        new Passenger('Tomer Dahan', '305478291')
      ],
      '',
      true
    ),
    new Booking(
      'BK1010',
      'Bangkok',
      'Tokyo',
      '',
      '',
      6,
      [
        new Passenger('Hadar Maymon', '322334244'),
        new Passenger('Ran Bar', '312487622'),
        new Passenger('Noga Levi', '309812675'),
        new Passenger('Lior Cohen', '205678943'),
        new Passenger('Elior Ben-Ami', '278943512'),
        new Passenger('Maya Azulay', '208754123')
      ],
      '',
      true
    )
  ];

  constructor(private destinationsService: DestinationsService) {}

  getAllBookings(): Observable<Booking[]> {
    this.assignDynamicDates();
  
    const destinationRequests = this.bookings.map(booking =>
      this.destinationsService.getDestinationByName(booking.destination).pipe(
        map((destination) => {
          console.log('Fetched Destination:', destination);  
          booking.image = destination?.image || 'https://via.placeholder.com/300';
          return booking;
        })
      )
    );
  
    return forkJoin(destinationRequests);
  }
  
  getBookingById(bookingId: string): Observable<Booking | undefined> {
    const booking = this.bookings.find(b => b.bookingId === bookingId);

    if (!booking) {
      return of(undefined);
    }

    return this.destinationsService.getDestinationByName(booking.destination).pipe(
      map(destination => {
        booking.image = destination?.image || 'assets/default-destination.jpg';
        return booking;
      })
    );
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
