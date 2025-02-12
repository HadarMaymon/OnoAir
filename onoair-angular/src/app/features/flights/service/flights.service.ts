import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  getDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from '@angular/fire/firestore';
import { Flight } from '../model/flight';
import { Destination } from '../../destinations/models/destination';
import { FlightStatus } from '../model/flight-status.enum';
import { MatDialog } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private flightsSubject = new BehaviorSubject<Flight[]>([]);
  flights$ = this.flightsSubject.asObservable();

  constructor(private firestore: Firestore, private dialog: MatDialog) {
    this.syncFlights();
  }


  /**
   * Syncs flights from Firestore and enriches them with destination images.
   */
  private async syncFlights(): Promise<void> {
    const flightCollection = collection(this.firestore, 'flights');
    const destinationCollection = collection(this.firestore, 'destinations');
  
    // Fetch destinations once
    const destinations = await this.getAllDestinations(destinationCollection);
  
    // Sync flights in real-time
    onSnapshot(flightCollection, (snapshot) => {
      const flights: Flight[] = snapshot.docs.map((doc) => {
        const data = doc.data();
  
        return new Flight(
          data['flightNumber'] || '',
          data['origin'] || '',
          data['destination'] || '',
          data['date'] instanceof Timestamp ? data['date'].toDate() : new Date(data['date']), // ✅ Convert Timestamp
          data['departureTime'] || '',
          data['arrivalDate'] instanceof Timestamp ? data['arrivalDate'].toDate() : new Date(data['arrivalDate']), // ✅ Convert Timestamp
          data['arrivalTime'] || '',
          data['price'] || 0,
          data['image'] || 'https://via.placeholder.com/300',
          data['availableSeats'] || 0,
          data['isDynamicDate'] || false,
          (data['status'] as FlightStatus) || FlightStatus.Active,
          false
        );
      });
  
      // Enrich flights with images
      flights.forEach((flight) => {
        const matchingDestination = destinations.find(
          (d) => d.destinationName.trim().toLowerCase() === flight.destination.trim().toLowerCase()
        );
        flight.image = matchingDestination?.image || 'https://via.placeholder.com/300';
      });
  
      // ✅ Update BehaviorSubject
      this.flightsSubject.next(flights);
    });
  }
  


  /**
   * Fetches all destinations from Firestore.
   */
  private async getAllDestinations(
    destinationCollection: any
  ): Promise<Destination[]> {
    const snapshot = await getDocs(destinationCollection);
    return snapshot.docs.map((doc) => doc.data() as Destination);
  }

  /**
   * Updates a flight in Firestore.
   */
  updateFlight(flight: Flight): Promise<void> {
    const flightCollection = collection(this.firestore, 'flights');
    const flightDoc = doc(flightCollection, flight.flightNumber);
    return setDoc(flightDoc, { 
      ...flight, 
      date: Timestamp.fromDate(flight.date), // ✅ Ensure it's stored as a Firestore Timestamp
      arrivalDate: Timestamp.fromDate(flight.arrivalDate), // ✅ Ensure it's stored as a Firestore Timestamp
      status: flight.status as FlightStatus 
    }).then(() => {
      console.log(`Flight ${flight.flightNumber} updated successfully!`);
    });
  }
  


  /**
   * Deletes a flight from Firestore.
   */
  async deleteFlight(flightNumber: string): Promise<void> {
  try {
    const flightDoc = doc(this.firestore, 'flights', flightNumber);
    await deleteDoc(flightDoc);
    console.log(`Flight ${flightNumber} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting flight ${flightNumber}:`, error);
    throw error; // Ensure error is handled properly
  }
}


async getFlightBookings(flightNumber: string): Promise<boolean> {
  const bookingsCollection = collection(this.firestore, 'bookings');
  const bookingsQuery = query(bookingsCollection, where('flightNumber', '==', flightNumber));
  const bookingSnapshot = await getDocs(bookingsQuery);

  console.log(`Checking bookings for flight ${flightNumber}:`, bookingSnapshot.size); 

  return !bookingSnapshot.empty; 
}


  
  /**
   * Fetches a flight by its number from Firestore.
   */
  getFlightByNumber(flightNumber: string): Promise<Flight | undefined> {
    const flightDoc = doc(this.firestore, 'flights', flightNumber);
    return getDoc(flightDoc).then((snapshot) =>
      snapshot.exists() ? (snapshot.data() as Flight) : undefined
    );
  }

  /**
   * Retrieves a list of unique flight origins.
   */
  getOrigins(): Promise<string[]> {
    const flightCollection = collection(this.firestore, 'flights');
    return getDocs(flightCollection).then((snapshot) => {
      const origins = snapshot.docs.map(
        (doc) => doc.data()['origin'] as string
      );
      return Array.from(new Set(origins));
    });
  }

  /**
   * Retrieves a list of unique flight destinations.
   */
  getDestinations(): Promise<string[]> {
    const flightCollection = collection(this.firestore, 'flights');
    return getDocs(flightCollection).then((snapshot) => {
      const destinations = snapshot.docs.map(
        (doc) => doc.data()['destination'] as string
      );
      return Array.from(new Set(destinations));
    });
  }

  /**
   * Fetches flights within a specific date range.
   */
  getFlightsByDateRange(startDate: Date, endDate: Date): Observable<Flight[]> {
    const flightsRef = collection(this.firestore, 'flights');
    const flightsQuery = query(
      flightsRef,
      where('date', '>=', Timestamp.fromDate(startDate)), // ✅ Convert to Timestamp
      where('date', '<=', Timestamp.fromDate(endDate)), // ✅ Convert to Timestamp
      orderBy('date')
    );
  
    return new Observable<Flight[]>((observer) => {
      const unsubscribe = onSnapshot(
        flightsQuery,
        (snapshot) => {
          const flights = snapshot.docs.map((doc) => {
            const data = doc.data();
            return new Flight(
              data['flightNumber'] || '',
              data['origin'] || '',
              data['destination'] || '',
              data['date'] instanceof Timestamp ? data['date'].toDate() : new Date(data['date']),
              data['departureTime'] || '',
              data['arrivalDate'] instanceof Timestamp ? data['arrivalDate'].toDate() : new Date(data['arrivalDate']),
              data['arrivalTime'] || '',
              data['price'] || 0,
              data['image'] || 'https://via.placeholder.com/300',
              data['availableSeats'] || 0,
              data['isDynamicDate'] || false,
              (data['status'] as FlightStatus) || FlightStatus.Active,
              false
            );
          });
  
          observer.next(flights);
        },
        (error) => {
          observer.error(error);
        }
      );
  
      return () => unsubscribe();
    });
  }
  
}
