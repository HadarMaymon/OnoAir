import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Firestore, collection, doc, setDoc, getDocs, onSnapshot, getDoc, deleteDoc } from '@angular/fire/firestore';
import { Flight } from '../model/flight';
import { Destination } from '../../destinations/models/destination';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private flightsSubject = new BehaviorSubject<Flight[]>([]);
  flights$ = this.flightsSubject.asObservable();

  constructor(private firestore: Firestore) {
    this.syncFlights();
  }

  /**
   * Sync flights in real-time with Firestore, takes images from destination
   */
  private syncFlights(): void {
    const flightCollection = collection(this.firestore, 'flights');
    onSnapshot(flightCollection, async (snapshot) => {
      const flights = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }) as unknown as Flight);
  
      // Fetch all destinations to map images
      const destinations = await this.getAllDestinations();
  
      // Add images to flights
      flights.forEach((flight) => {
        if (!flight.image || flight.image === '') {
          const destination = destinations.find((d) => d.destinationName === flight.destination);
          flight.image = destination?.image || 'https://via.placeholder.com/300'; // Default fallback image
        }
      });
  
      // Update flightsSubject with enriched flight data
      this.flightsSubject.next(flights);
    });
  }
  
  private async getAllDestinations(): Promise<Destination[]> {
    const destinationCollection = collection(this.firestore, 'destinations');
    const destinationSnapshot = await getDocs(destinationCollection);
    return destinationSnapshot.docs.map((doc) => doc.data() as Destination);
  }
  
  /**
   * Add a new flight to Firestore
   */
  addFlight(flight: Flight): Promise<void> {
    const flightCollection = collection(this.firestore, 'flights');
    const flightDoc = doc(flightCollection, flight.flightNumber); 
    return setDoc(flightDoc, { ...flight })
      .then(() => {
        console.log(`Flight ${flight.flightNumber} added successfully!`);
      });
  }
  

  /**
   * Update an existing flight in Firestore
   */
  updateFlight(flight: Flight): Promise<void> {
    const flightCollection = collection(this.firestore, 'flights');
    const flightDoc = doc(flightCollection, flight.flightNumber);
    return setDoc(flightDoc, { ...flight }).then(() => {
      console.log(`Flight ${flight.flightNumber} updated successfully!`);
    });
  }

  /**
   * Delete a flight from Firestore
   */
  deleteFlight(flightNumber: string): Promise<void> {
    const flightDoc = doc(this.firestore, 'flights', flightNumber);
    return deleteDoc(flightDoc).then(() => {
      console.log(`Flight ${flightNumber} deleted successfully!`);
    });
  }

  /**
   * Get flight details by flight number
   */
  getFlightByNumber(flightNumber: string): Promise<Flight | undefined> {
    const flightDoc = doc(this.firestore, 'flights', flightNumber);
    return getDoc(flightDoc).then((snapshot) =>
      snapshot.exists() ? (snapshot.data() as Flight) : undefined
    );
  }

  /**
   * Get unique origins from Firestore
   */
  getOrigins(): Promise<string[]> {
    const flightCollection = collection(this.firestore, 'flights');
    return getDocs(flightCollection)
      .then((snapshot) => {
        const origins = snapshot.docs.map((doc) => doc.data()['origin'] as string);
        return Array.from(new Set(origins));
      });
  }

  /**
   * Get unique destinations from Firestore
   */
  getDestinations(): Promise<string[]> {
    const flightCollection = collection(this.firestore, 'flights');
    return getDocs(flightCollection)
      .then((snapshot) => {
        const destinations = snapshot.docs.map((doc) => doc.data()['destination'] as string);
        return Array.from(new Set(destinations));
      });
  }
}
