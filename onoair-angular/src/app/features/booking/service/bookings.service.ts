import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, onSnapshot, getDoc, updateDoc, runTransaction } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Booking } from '../models/booking';
import { bookingConverter } from './converters/booking-converter';
import { DestinationsService } from '../../destinations/service/destinations.service';
import { BookingStatus } from '../models/booking-status.enum';
import { Timestamp } from 'firebase/firestore';
import { Passenger } from '../models/passenger';
import { Luggage } from '../models/luggage';
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
   * Sync bookings from Firestore and attach destination images efficiently.
   */
  async syncBookingsWithImages(): Promise<void> {
    const bookingCollection = collection(this.firestore, 'bookings').withConverter(bookingConverter);
  
    try {
      console.log('Fetching destinations...');
      const destinations = await this.destinationsService.getAllDestinations();
      console.log('Destinations loaded:', destinations);
  
      onSnapshot(bookingCollection, (snapshot) => {
        const bookings = snapshot.docs.map((doc) => {
            const data = doc.data();
    
            return new Booking(
                data.bookingId,
                data.flightNumber,
                data.origin,
                data.destination,
                data.boarding instanceof Timestamp ? data.boarding.toDate() : new Date(data.boarding),
                data.departureTime || '00:00',
                data.landing instanceof Timestamp ? data.landing.toDate() : new Date(data.landing),
                data.arrivalTime || '00:00',
                data.numberOfPassengers,
                data.passengers?.map((p: { name: string; id: string; luggage?: any }) =>
                    new Passenger(p.name, p.id, new Luggage(
                        p.luggage?.cabin || 0, 
                        p.luggage?.checked || 0, 
                        p.luggage?.heavy || 0
                    ))
                ) || [],
                destinations.find(dest => dest.destinationName === data.destination)?.image || 'assets/images/default-destination.jpg',
                data.isDynamicDate,
                data.status as BookingStatus
            );
        });
    
        console.log('Final Bookings:', bookings);
        this.bookingsSubject.next(bookings);
    });
    
    } 
    catch (error) {
      console.error('Error syncing bookings:', error);
    }
  }
  

  /*
   * Get a specific booking by its ID.
   */
  getBookingById(bookingId: string): Promise<Booking | undefined> {
    const bookingDoc = doc(this.firestore, 'bookings', bookingId).withConverter(bookingConverter);
    return getDoc(bookingDoc)
      .then((snapshot) => (snapshot.exists() ? snapshot.data() : undefined))
      .catch((error) => {
        console.error(` Error fetching booking ${bookingId}:`, error);
        return undefined;
      });
  }

  /**
   * Add a new booking using Firestore transactions (ensures data consistency).
   */
  async addBooking(booking: Booking): Promise<void> {
    const bookingDoc = doc(this.firestore, 'bookings', booking.bookingId);
    const flightDoc = doc(this.firestore, 'flights', booking.flightNumber);

    try {
        await runTransaction(this.firestore, async (transaction) => {
            const flightSnapshot = await transaction.get(flightDoc);

            if (!flightSnapshot.exists()) {
                throw new Error(`Flight ${booking.flightNumber} not found.`);
            }

            const boardingTimestamp = booking.boarding instanceof Timestamp 
                ? booking.boarding 
                : Timestamp.fromDate(new Date(booking.boarding));

            const landingTimestamp = booking.landing instanceof Timestamp 
                ? booking.landing 
                : Timestamp.fromDate(new Date(booking.landing));

            transaction.set(bookingDoc, {
                ...booking,
                boarding: boardingTimestamp,
                landing: landingTimestamp,
                passengers: booking.passengers.map((p) => ({
                    id: p.id,
                    name: p.name,
                    luggage: {
                        cabin: p.luggage?.cabin || 0,
                        checked: p.luggage?.checked || 0,
                        heavy: p.luggage?.heavy || 0,
                    }
                })) 
            });
        });

        console.log(` Booking ${booking.bookingId} successfully created.`);
    } catch (error) {
        console.error(` Error creating booking:`, error);
    }
}




  /**
   * Update an existing booking efficiently.
   */
  updateBooking(booking: Booking): Promise<void> {
    const bookingDoc = doc(this.firestore, 'bookings', booking.bookingId);
    
    return setDoc(bookingDoc, {
      ...booking, 
      boarding: booking.boarding instanceof Timestamp 
      ? booking.boarding 
      : Timestamp.fromDate(new Date(booking.boarding)),
  
  landing: booking.landing instanceof Timestamp 
      ? booking.landing 
      : Timestamp.fromDate(new Date(booking.landing)),
  
    })
  }
  
  
  /**
   * Cancel a booking by setting its status to "Canceled".
   */
  updateBookingStatus(bookingId: string, newStatus: BookingStatus): Promise<void> {
    const bookingDoc = doc(this.firestore, `bookings/${bookingId}`);

    return updateDoc(bookingDoc, { status: newStatus })
      .then(() => {
        console.log(`Booking ${bookingId} updated to ${newStatus}`);
      })
      .catch((error) => {
        console.error(`Error updating booking ${bookingId} to ${newStatus}:`, error);
        throw error;
      });
  }
}


