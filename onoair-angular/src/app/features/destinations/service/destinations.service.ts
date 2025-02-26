import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Firestore, collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, getDoc, collectionData, updateDoc, where, query, Timestamp } from '@angular/fire/firestore';
import { Destination } from '../models/destination';
import { DestinationStatus } from '../models/destination-status.enum'; // Import the enum
import { destinationConverter } from './converter/destination-converter';
import { Flight } from '../../flights/model/flight';
import { FlightStatus } from '../../flights/model/flight-status.enum';

@Injectable({
  providedIn: 'root',
})
export class DestinationsService {
  private destinationsSubject = new BehaviorSubject<Destination[]>([]);
  destinations$ = this.destinationsSubject.asObservable();

  constructor(private firestore: Firestore) {
    this.syncDestinations(); // Start real-time syncing
  }

  /**
   * Sync destinations from Firestore in real-time, only including active destinations.
   */
  public syncDestinations(): void {
    const destinationCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
    onSnapshot(destinationCollection, (snapshot) => {
      const destinations = snapshot.docs.map((doc) => doc.data()); 
      this.destinationsSubject.next(destinations);
    });    
  }

  /**
   * Fetch all active destinations from Firestore.
   */
  public getAllDestinations(): Promise<Destination[]> {
    const destinationCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
    return getDocs(destinationCollection)
      .then((snapshot) =>
        snapshot.docs
          .map((doc) => doc.data())
          .filter((destination) => destination.status === DestinationStatus.Active) // Only active destinations
      )
      .catch((error) => {
        console.error('Error fetching all destinations:', error);
        return [];
      });
  }

  /**
   * Fetch names of all active destinations.
   */
  public getAllDestinationNames(): Observable<string[]> {
    const destinationsRef = collection(this.firestore, 'destinations').withConverter(destinationConverter);
    return collectionData(destinationsRef).pipe(
      map((destinations: Destination[]) =>
        destinations
          .filter((destination) => destination.status === DestinationStatus.Active) // Only active destinations
          .map((d) => d.destinationName)
      )
    );
  }

  /**
   * Add a new destination to Firestore.
   */
  public addDestination(destination: Destination): Promise<void> {
    if (!destination.IATA) {
      console.error('Error: IATA Code is required for adding a new destination.');
      return Promise.reject('IATA Code is required');
    }

    if (!destination.status) {
      console.error('Error: Status is required for adding a new destination.');
      return Promise.reject('Status is required');
    }

    const destinationCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
    const destinationDoc = doc(destinationCollection, destination.IATA); // Use IATA as document ID

    return setDoc(destinationDoc, destination)
      .then(() => {
        console.log(`Destination ${destination.destinationName} added successfully.`);
      })
      .catch((error) => {
        console.error(` Error adding destination:`, error);
        throw error;
      });
  }

/**
 * Update an existing destination in Firestore, ensuring status is updated.
 */
public updateDestination(destination: Destination): Promise<void> {
  if (!destination.IATA) {
    console.error('Error: IATA Code is required for updating a destination.');
    return Promise.reject('IATA Code is required');
  }

  const destinationDoc = doc(this.firestore, 'destinations', destination.IATA).withConverter(destinationConverter);

  return setDoc(destinationDoc, { ...destination }, { merge: true }) // Ensure it updates only provided fields
    .then(() => console.log(`✔️ Destination ${destination.destinationName} updated successfully in Firestore`))
    .catch(error => {
      console.error('⚠️ Firestore update failed:', error);
      throw error;
    });
}



  /**
   * Delete a destination from Firestore.
   */
  public async deleteDestination(IATA: string): Promise<void> {
    // Fetch the destination first
    const destination = await this.getDestinationByIATA(IATA);
    if (!destination) {
      console.warn(`Destination with IATA ${IATA} not found.`);
      return;
    }
  
    // Check for active flights before deleting
    const activeFlights = await this.getActiveFlightsForDestination(destination.destinationName);
    if (activeFlights.length > 0) {
      console.warn(`Cannot delete destination ${destination.destinationName}, it has active flights.`);
      return Promise.reject(`Destination ${destination.destinationName} has active flights and cannot be deleted.`);
    }
  
    // Proceed with deletion if no active flights exist
    const destinationDoc = doc(this.firestore, 'destinations', IATA).withConverter(destinationConverter);
    return deleteDoc(destinationDoc)
      .then(() => console.log(` Destination with IATA ${IATA} deleted successfully!`))
      .catch(error => console.error(` Error deleting destination:`, error));
  }
  
  
  /**
   * Get a single destination by its IATA code.
   */
  public getDestinationByIATA(IATA: string): Promise<Destination | undefined> {
    const destinationDoc = doc(this.firestore, 'destinations', IATA).withConverter(destinationConverter);
    return getDoc(destinationDoc)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const destination = snapshot.data();
          console.log(`Destination fetched:`, destination); 
          return destination; //
        } else {
          console.warn(`Destination with IATA ${IATA} not found.`);
          return undefined;
        }
      })
      .catch((error: unknown) => {
        console.error(`Error fetching destination with IATA ${IATA}:`, error);
        return undefined;
      });
  }

  public async cancelDestination(IATA: string): Promise<void> {
    // Fetch the destination first
    const destination = await this.getDestinationByIATA(IATA);
    if (!destination) {
      console.warn(` Destination with IATA ${IATA} not found.`);
      return;
    }
  
    // Check for active flights before canceling
    const activeFlights = await this.getActiveFlightsForDestination(destination.destinationName);
    if (activeFlights.length > 0) {
      console.warn(`Cannot cancel destination ${destination.destinationName}, it has active flights.`);
      return Promise.reject(`Destination ${destination.destinationName} has active flights and cannot be canceled.`);
    }
  
    // 🔹 Proceed with cancellation if no active flights exist
    const destinationRef = doc(this.firestore, `destinations/${IATA}`);
    return updateDoc(destinationRef, { status: DestinationStatus.Canceled })
      .then(() => console.log(`Destination ${IATA} has been canceled.`))
      .catch(error => {
        console.error(`Error canceling destination ${IATA}:`, error);
        throw error;
      });
  }
  
  async getActiveFlightsForDestination(destinationName: string): Promise<Flight[]> {
    const flightsRef = collection(this.firestore, 'flights');
  
    const q = query(
      flightsRef,
      where('destination', '==', destinationName),
      where('status', '==', 'Activated') // Only activated flights
    );
  
    const querySnapshot = await getDocs(q);
    const now = new Date();
  
    return querySnapshot.docs
      .map(doc => {
        const data = doc.data();
  
        return new Flight(
          data['flightNumber'],
          data['origin'],
          data['destination'],
          data['date'] instanceof Timestamp ? data['date'].toDate() : new Date(data['date']), 
          data['departureTime'],
          data['arrivalDate'] instanceof Timestamp ? data['arrivalDate'].toDate() : new Date(data['arrivalDate']), 
          data['arrivalTime'],
          data['price'],
          data['image'] || '',
          data['availableSeats'],
          data['isDynamicDate'],
          data['status'] as FlightStatus,
          false 
        );
      })
      .filter(flight => flight.date >= now); 
  }
  
}  