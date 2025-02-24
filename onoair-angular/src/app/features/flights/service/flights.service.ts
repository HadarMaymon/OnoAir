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
import { DocumentData, QueryDocumentSnapshot, QuerySnapshot, Timestamp } from 'firebase/firestore';

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
  
      // Enrich flights with images
      flights.forEach((flight) => {
        const matchingDestination = destinations.find(
          (d) => d.destinationName.trim().toLowerCase() === flight.destination.trim().toLowerCase()
        );
        flight.image = matchingDestination?.image || 'https://via.placeholder.com/300';
      });
  
     
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
      date: Timestamp.fromDate(flight.date), 
      arrivalDate: Timestamp.fromDate(flight.arrivalDate), 
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

  console.log(`Checking bookings for flight ${flightNumber}: Found ${bookingSnapshot.size} bookings`);

  // Get the current date
  const currentDate = new Date();

  // Convert Firestore documents into an array of booking objects
  const bookings = bookingSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      status: data['status'], // "Active" or "Canceled"
      date: data['boarding'] instanceof Timestamp ? data['boarding'].toDate() : null, // Convert Firestore timestamp to Date
    };
  });

  // Check if there is at least ONE "active" and "future" booking
  const hasActiveFutureBooking = bookings.some(booking => 
    booking.status === 'Active' && booking.date && booking.date > currentDate
  );

  console.log(`🚨 Active & Future Booking Exists: ${hasActiveFutureBooking}`);

  return hasActiveFutureBooking; // Return true if at least one active future booking exists
}


  
  /**
   * Fetches a flight by its number from Firestore.
   */

  async getFlightByNumber(flightNumber: string): Promise<Flight | undefined> {
    const flightDoc = doc(this.firestore, 'flights', flightNumber);
    const snapshot = await getDoc(flightDoc);
  
    if (!snapshot.exists()) {
      return undefined;
    }
  
    const flightData = snapshot.data();
    console.log("Raw Firestore Data:", flightData); // 🔍 Debugging output
  
    return {
      ...flightData,
      date: flightData['date'] instanceof Timestamp ? flightData['date'].toDate() : null, 
      arrivalDate: flightData['arrivalDate'] instanceof Timestamp ? flightData['arrivalDate'].toDate() : null,
    } as Flight;
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
      where('date', '>=', Timestamp.fromDate(startDate)), 
      where('date', '<=', Timestamp.fromDate(endDate)), 
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

  hasActiveBookings(flightNumber: string): Promise<boolean> {
    const bookingsCollection = collection(this.firestore, 'bookings');
    const bookingQuery = query(
      bookingsCollection,
      where('flightNumber', '==', flightNumber),
      where('status', '==', 'Active') // Only check Active bookings
    );
  
    return getDocs(bookingQuery).then((snapshot) => {
      return !snapshot.empty; 
    });
  }  

  getLatestBookingDate(flightNumber: string): Promise<Date | null> {
    const bookingsCollection = collection(this.firestore, 'bookings');
    const bookingQuery = query(
      bookingsCollection,
      where('flightNumber', '==', flightNumber),
      where('status', '==', 'Active') // Only check active bookings
    );
  
    return getDocs(bookingQuery).then((snapshot) => {
      if (snapshot.empty) {
        return null; // No active bookings, so editing is allowed
      }
  
      // Find the earliest boarding date
      let earliestDate: Date | null = null;
  
      snapshot.docs.forEach((doc) => {
        const booking = doc.data();
        if (booking['boarding'] instanceof Timestamp) {
          const boardingDate = booking['boarding'].toDate();
          if (!earliestDate || boardingDate < earliestDate) {
            earliestDate = boardingDate;
          }
        }
      });
  
      return earliestDate;
    });
  }

  async getActiveFlightsForDestination(destinationName: string): Promise<Flight[]> {
    console.log(`📡 Fetching active flights for ${destinationName}...`);
  
    const flightsRef = collection(this.firestore, 'flights');
  
    // Query 1: Get flights where destination matches
    const destinationQuery = query(
      flightsRef,
      where('destination', '==', destinationName.trim()),
      where('status', '==', "Activated")
    );
  
    // Query 2: Get flights where origin matches
    const originQuery = query(
      flightsRef,
      where('origin', '==', destinationName.trim()),
      where('status', '==', "Activated")
    );
  
    // 🔹 Run both queries in parallel
    const [destinationSnapshot, originSnapshot] = await Promise.all([
      getDocs(destinationQuery),
      getDocs(originQuery)
    ]);
  
    console.log(`Found ${destinationSnapshot.size} flights as destination`);
    console.log(`Found ${originSnapshot.size} flights as origin`);
  
    if (destinationSnapshot.empty && originSnapshot.empty) {
      console.warn("⚠️ No active flights found! Check Firestore data.");
    }
  
    // Combine results (Avoid duplicates by using a Map)
    const flightsMap = new Map();
  
    const addFlights = (snapshot: QuerySnapshot<DocumentData>) => {
      snapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        if (!flightsMap.has(data['flightNumber'])) {
          flightsMap.set(data['flightNumber'], new Flight(
            data['flightNumber'],
            data['origin'].trim(),
            data['destination'].trim(),
            data['date'] instanceof Timestamp ? data['date'].toDate() : new Date(data['date']),
            data['departureTime'],
            data['arrivalDate'] instanceof Timestamp ? data['arrivalDate'].toDate() : new Date(data['arrivalDate']),
            data['arrivalTime'],
            data['price'],
            data['image'] || '',
            data['availableSeats'],
            data['isDynamicDate'],
            data['status'].trim(),
            false 
          ));
        }
      });
    };
    
  
    addFlights(destinationSnapshot);
    addFlights(originSnapshot);
  
    const flights = Array.from(flightsMap.values());
  
    console.log(`Total active flights found: ${flights.length}`);
    return flights;
  }
  

  
  async testQuery(): Promise<void> {
    console.log("🛠 Running Firestore test query for active flights...");
  
    const flightsRef = collection(this.firestore, 'flights');
  
    const q = query(
      flightsRef,
      where('destination', '==', "Paris"),
      where('status', '==', "Activated")
    );
  
    const querySnapshot = await getDocs(q);
  
    console.log(`Firestore query result: Found ${querySnapshot.size} flights`);
  
    querySnapshot.docs.forEach(doc => console.log('🛫 Firestore Flight Data:', doc.data()));
  
    if (querySnapshot.empty) {
      console.warn(" No flights found. Check for whitespace issues or case mismatches!");
    }
  }
  
  
}
