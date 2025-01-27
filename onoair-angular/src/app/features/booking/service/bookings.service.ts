import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, onSnapshot, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Booking } from '../models/booking';
import { bookingConverter } from './converters/booking-converter';
import { DestinationsService } from '../../destinations/service/destinations.service';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  bookings$ = this.bookingsSubject.asObservable();

  constructor(private firestore: Firestore, private destinationsService: DestinationsService) {
    this.syncBookingsWithImages(); // Start syncing bookings in real-time
  }

  /**
   * Sync bookings from Firestore and attach destination images.
   */
  syncBookingsWithImages(): void {
    const bookingCollection = collection(this.firestore, 'bookings').withConverter(bookingConverter);

    onSnapshot(bookingCollection, async (snapshot) => {
      const bookings = snapshot.docs.map((doc) => doc.data());

      // Fetch destinations from Firestore
      const destinations = await this.destinationsService.getAllDestinations();

      // Map images to bookings
      bookings.forEach((booking) => {
        const destination = destinations.find((dest) => dest.destinationName === booking.destination);
        booking.image = destination?.image || 'assets/images/default-destination.jpg'; // Fallback image
      });

      // Update the observable with enriched bookings
      this.bookingsSubject.next(bookings);
    });
  }

  /**
   * Get a specific booking by its ID.
   */
  getBookingById(bookingId: string): Promise<Booking | undefined> {
    const bookingDoc = doc(this.firestore, 'bookings', bookingId).withConverter(bookingConverter);
    return getDoc(bookingDoc)
      .then((snapshot) => (snapshot.exists() ? snapshot.data() : undefined))
      .catch((error) => {
        console.error(`Error fetching booking with ID ${bookingId}:`, error);
        return undefined;
      });
  }

  /**
   * Add a new booking to Firestore.
   */
  addBooking(booking: Booking): Promise<void> {
    const bookingCollection = collection(this.firestore, 'bookings').withConverter(bookingConverter);
    const bookingDoc = doc(bookingCollection, booking.bookingId);
    return setDoc(bookingDoc, booking).then(() => {
      console.log(`Booking ${booking.bookingId} added successfully.`);
    });
  }

  /**
   * Update an existing booking in Firestore.
   */
  updateBooking(booking: Booking): Promise<void> {
    const bookingCollection = collection(this.firestore, 'bookings').withConverter(bookingConverter);
    const bookingDoc = doc(bookingCollection, booking.bookingId);
    return setDoc(bookingDoc, booking).then(() => {
      console.log(`Booking ${booking.bookingId} updated successfully.`);
    });
  }
}
