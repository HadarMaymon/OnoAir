import { Injectable } from '@angular/core';
import { Booking } from '../models/booking';
import { Passenger } from '../../destinations/models/passenger';
import { Firestore, collection, doc, setDoc, onSnapshot, getDoc, DocumentSnapshot} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { bookingConverter } from './converters/booking-converter';
import { DestinationsService} from '../../destinations/service/destinations.service';
import { destinationConverter } from '../../destinations/service/converter/destination-converter';

@Injectable({
  providedIn: 'root',
})

export class BookingsService {

  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  bookings$ = this.bookingsSubject.asObservable();


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


  constructor(private firestore: Firestore, private destinationsService: DestinationsService) {}

  /**
   * Upload static bookings to Firestore (Run once to populate Firestore with initial data)
   */
  uploadStaticBookings(): Promise<void> {
    const bookingCollection = collection(this.firestore, 'bookings').withConverter(bookingConverter);

    const uploadPromises = this.bookings.map((booking) => {
      if (booking.isDynamicDate) {
        // Generate random boarding and landing dates
        const boardingDate = this.getRandomFutureDate(1, 30);
        const flightDuration = this.getFlightDuration(booking.origin, booking.destination);
        const timeZoneDifference = this.getTimeZoneDifference(booking.origin, booking.destination);
        const landingDate = this.calculateLandingTime(boardingDate, flightDuration, timeZoneDifference);

        booking.boarding = boardingDate;
        booking.landing = landingDate;
      }

      const bookingDoc = doc(bookingCollection, booking.bookingId);
      return setDoc(bookingDoc, booking).catch((error) => {
        console.error(`Error uploading booking ${booking.bookingId}:`, error);
      });
    });

    return Promise.all(uploadPromises).then(() => {
      console.log('All static bookings uploaded successfully!');
    }).catch((error) => {
      console.error('Error uploading static bookings:', error);
    });
  }

  /**
   * Sync bookings with Firestore and fetch associated destination images
   */
  syncBookingsWithImages(): void {
    const bookingCollection = collection(this.firestore, 'bookings').withConverter(bookingConverter);
  
    onSnapshot(bookingCollection, async (snapshot) => {
      const bookings = snapshot.docs.map((doc) => doc.data());
      
      // Fetch destinations from the DestinationService
      const destinations = await this.destinationsService.getAllDestinations();
  
      // Map images to bookings
      bookings.forEach((booking) => {
        const destination = destinations.find((dest) => dest.destinationName === booking.destination);
        if (destination) {
          booking.image = destination.image; // Attach the image from DestinationService
        } else {
          booking.image = 'assets/images/default-destination.jpg'; // Fallback image
        }
      });
  
      this.bookingsSubject.next(bookings);
    });
  }
    
  // Helper method to get destination image
  private async getDestinationImage(location: string): Promise<string | undefined> {
    const destinationDoc = doc(this.firestore, 'destinations', location).withConverter(destinationConverter);
    const snapshot = await getDoc(destinationDoc);
    return snapshot.exists() ? (snapshot.data()?.image as string) : undefined;
  }
  
  getBookingById(bookingId: string): Promise<Booking | undefined> {
    const bookingDoc = doc(this.firestore, 'bookings', bookingId).withConverter(bookingConverter);

    return getDoc(bookingDoc)
      .then((snapshot) => (snapshot.exists() ? snapshot.data() : undefined))
      .catch((error) => {
        console.error(`Error fetching booking with ID ${bookingId}:`, error);
        return undefined;
      });
  }

  private getRandomFutureDate(minDays: number, maxDays: number): string {
    const today = new Date();
    const randomDaysToAdd = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
    today.setDate(today.getDate() + randomDaysToAdd);

    const formattedDate = today.toLocaleDateString('en-GB');
    const time = randomDaysToAdd % 2 === 0 ? '10:00' : '14:00';
    return `${formattedDate} ${time}`;
  }

  private calculateLandingTime(boarding: string, flightDuration: number, timeZoneDifference: number): string {
    const [day, month, yearAndTime] = boarding.split('/');
    const [year, time] = yearAndTime.split(' ');
    const [hours, minutes] = time.split(':');
    const boardingDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));

    boardingDate.setHours(boardingDate.getHours() + flightDuration + timeZoneDifference);

    const formattedDate = boardingDate.toLocaleDateString('en-GB');
    const formattedTime = boardingDate.toTimeString().slice(0, 5);
    return `${formattedDate} ${formattedTime}`;
  }

  private getFlightDuration(origin: string, destination: string): number {
    const flightDurations: { [key: string]: { [key: string]: number } } = {
      'Tel Aviv': { 'Berlin': 4, 'Paris': 5 },
      'Bangkok': { 'Tokyo': 6 },
      'Krakow': { 'Bora Bora': 12 },
    };

    return flightDurations[origin]?.[destination] || 3;
  }

  private getTimeZoneDifference(origin: string, destination: string): number {
    const timeZones: { [key: string]: number } = {
      'Tel Aviv': 2,
      'Berlin': 1,
      'Paris': 1,
      'Bangkok': 7,
      'Tokyo': 9,
    };

    const originOffset = timeZones[origin] || 0;
    const destinationOffset = timeZones[destination] || 0;

    return destinationOffset - originOffset;
  }
}
