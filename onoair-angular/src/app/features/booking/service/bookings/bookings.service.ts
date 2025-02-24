import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, onSnapshot, getDoc, updateDoc, runTransaction } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Booking } from '../../models/booking';
import { bookingConverter } from '../converters/booking-converter';
import { DestinationsService } from '../../../destinations/service/destinations.service';
import { BookingStatus } from '../../models/booking-status.enum';
import { Timestamp } from 'firebase/firestore';
import { LuggageService } from '../luggage/luggage.service';
@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  bookings$ = this.bookingsSubject.asObservable();

  constructor(private firestore: Firestore, private destinationsService: DestinationsService, private luggageService: LuggageService) {
    this.syncBookingsWithImages(); 
    this.syncBookingsWithLuggage();  
  }

  /**
   * Sync bookings from Firestore and attach destination images efficiently.
   */
  syncBookingsWithImages(): void {
    const bookingCollection = collection(this.firestore, 'bookings').withConverter(bookingConverter);
  
    onSnapshot(bookingCollection, async (snapshot) => {
      try {
        console.log('📡 Firestore snapshot received:', snapshot.docs.map((doc) => doc.data()));

        if (snapshot.empty) {
          console.warn(' No bookings found in Firestore!');
          return;
        }

        const destinations = await this.destinationsService.getAllDestinations();

        let bookings = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log(` Booking ${data.bookingId}: Raw Boarding ->`, data.boarding, " | Raw Landing ->", data.landing);

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
            data.passengers?.map((p: { name: string; id: string; luggage?: any }) => ({
              name: p.name,
              id: p.id,
              luggage: p.luggage || { cabin: 0, checked: 0, heavy: 0 } 
            })) || [],
                    destinations.find(dest => dest.destinationName === data.destination)?.image || 'assets/images/default-destination.jpg',
            data.isDynamicDate,
            data.status as BookingStatus
          );
        });

        console.log('Processed Bookings:', bookings);
        this.bookingsSubject.next(bookings);
      } catch (error) {
        console.error('Error syncing bookings:', error);
      }
    });
  }


  /**
   * Get a specific booking by its ID.
   */
  async getBookingById(bookingId: string): Promise<Booking | undefined> {
    try {
      const bookingDoc = doc(this.firestore, 'bookings', bookingId).withConverter(bookingConverter);
      const snapshot = await getDoc(bookingDoc);

      if (!snapshot.exists()) {
        console.warn(` Booking ${bookingId} not found.`);
        return undefined;
      }

      const data = snapshot.data();
      console.log(`📄 Retrieved booking ${bookingId}:`, data);

      // Ensure passengers have luggage details
      const passengers = (data.passengers || []).map((p: any) => ({
        name: p.name,
        id: p.id,
        luggage: p.luggage || { cabin: 0, checked: 0, heavy: 0 }
      }));

      return new Booking(
        data.bookingId,
        data.flightNumber,
        data.origin,
        data.destination,
        data.boarding,
        data.departureTime || '00:00',
        data.landing,
        data.arrivalTime || '00:00',
        passengers.length,
        passengers,
        data.image || 'default-image.jpg',
        data.isDynamicDate || false,
        data.status as BookingStatus
      );
    } catch (error) {
      console.error(`Error fetching booking ${bookingId}:`, error);
      return undefined;
    }
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
          throw new Error(` Flight ${booking.flightNumber} not found.`);
        }
  
        console.log("Flight found, proceeding with booking...");
  
        // Ensure passengers have luggage before saving
        const passengersWithLuggage = booking.passengers.map(p => ({
          name: p.name,
          id: p.id,
          luggage: p.luggage || { cabin: 0, checked: 0, heavy: 0 }
        }));
  
        console.log("📦 Passengers with luggage:", passengersWithLuggage);
  
        transaction.set(bookingDoc, {
          ...booking,
          passengers: passengersWithLuggage,
          boarding: booking.boarding instanceof Timestamp 
            ? booking.boarding 
            : Timestamp.fromDate(new Date(booking.boarding)),
          landing: booking.landing instanceof Timestamp 
            ? booking.landing 
            : Timestamp.fromDate(new Date(booking.landing)),
        });
  
        console.log(` Booking ${booking.bookingId} successfully created.`);
      });
    } catch (error) {
      console.error(` Error creating booking:`, error);
      throw error;
    }
  }
  
  

  /**
   * Update an existing booking efficiently.
   */
  async updateBooking(booking: Booking): Promise<void> {
    try {
      const bookingDoc = doc(this.firestore, 'bookings', booking.bookingId);
      await setDoc(bookingDoc, {
        ...booking,
        passengers: booking.passengers.map(p => ({
          name: p.name,
          id: p.id,
          luggage: p.luggage || { cabin: 0, checked: 0, heavy: 0 }
        })),
        boarding: booking.boarding instanceof Timestamp 
          ? booking.boarding 
          : Timestamp.fromDate(new Date(booking.boarding)),
        landing: booking.landing instanceof Timestamp 
          ? booking.landing 
          : Timestamp.fromDate(new Date(booking.landing)),
      }, { merge: true });
  
      console.log(` Booking ${booking.bookingId} updated successfully.`);
    } catch (error) {
      console.error(` Error updating booking ${booking.bookingId}:`, error);
    }
  }
  
  
  
  /**
   * Cancel a booking by setting its status to "Canceled".
   */
  async updateBookingStatus(bookingId: string, newStatus: BookingStatus): Promise<void> {
    try {
      const bookingDoc = doc(this.firestore, `bookings/${bookingId}`);
      await updateDoc(bookingDoc, { status: newStatus });
      console.log(`Booking ${bookingId} updated to ${newStatus}`);
    } catch (error) {
      console.error(`Error updating booking ${bookingId} to ${newStatus}:`, error);
      throw error;
    }
  }

  syncBookingsWithLuggage(): void {
    const bookingCollection = collection(this.firestore, 'bookings').withConverter(bookingConverter);

    onSnapshot(bookingCollection, async (snapshot) => {
      try {
        console.log('📡 Firestore snapshot received:', snapshot.docs.map((doc) => doc.data()));

        if (snapshot.empty) {
          console.warn('No bookings found in Firestore!');
          return;
        }

        let bookings = await Promise.all(snapshot.docs.map(async (doc) => {
          const data = doc.data();
          console.log(`Booking ${data['bookingId']}: Raw Boarding ->`, data['boarding'], " | Raw Landing ->", data['landing']);

          // Fetch Luggage Data from LuggageService
          const passengersWithLuggage = await Promise.all(
            data['passengers'].map(async (p: any) => {
              const luggage = await this.luggageService.getLuggage(p.id, data['bookingId']);
              return { ...p, luggage };
            })
          );

          return new Booking(
            data['bookingId'],
            data['flightNumber'],
            data['origin'],
            data['destination'],
            data['boarding'] instanceof Timestamp ? data['boarding'].toDate() : new Date(data['boarding']),
            data['departureTime'] || '00:00',
            data['landing'] instanceof Timestamp ? data['landing'].toDate() : new Date(data['landing']),
            data['arrivalTime'] || '00:00',
            data['numberOfPassengers'],
            passengersWithLuggage,
            data['image'] || 'assets/images/default-destination.jpg',
            data['isDynamicDate'],
            data['status']
          );
        }));

        console.log('Processed Bookings with Luggage:', bookings);
        this.bookingsSubject.next(bookings);
      } catch (error) {
        console.error('Error syncing bookings:', error);
      }
    });
  }

}


