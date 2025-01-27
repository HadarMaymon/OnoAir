import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Firestore, collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, getDoc } from '@angular/fire/firestore';
import { Destination } from '../models/destination';
import { destinationConverter } from './converter/destination-converter';

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
   * Sync destinations from Firestore in real-time.
   */
  public syncDestinations(): void {
    const destinationCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
    onSnapshot(destinationCollection, (snapshot) => {
      const destinations = snapshot.docs.map((doc) => doc.data());
      this.destinationsSubject.next(destinations);
    });
  }


  /**
   * Get all destinations from Firestore.
   */
  public getAllDestinations(): Promise<Destination[]> {
    const destinationCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
    return getDocs(destinationCollection)
      .then((snapshot) => snapshot.docs.map((doc) => doc.data()))
      .catch((error) => {
        console.error('Error fetching all destinations:', error);
        return [];
      });
  }

  /**
   * Add a new destination to Firestore.
   */
  public addDestination(destination: Destination): Promise<void> {
    const destinationCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
    const destinationDoc = doc(destinationCollection, destination.IATA); // Use IATA as document ID
    return setDoc(destinationDoc, destination).then(() => {
      console.log(`Destination ${destination.destinationName} added successfully.`);
    });
  }

  /**
   * Update an existing destination in Firestore.
   */
  public updateDestination(destination: Destination): Promise<void> {
    const destinationCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
    const destinationDoc = doc(destinationCollection, destination.IATA); // Use IATA as document ID
    return setDoc(destinationDoc, destination).then(() => {
      console.log(`Destination ${destination.destinationName} updated successfully.`);
    });
  }

  /**
   * Delete a destination from Firestore.
   */
  public deleteDestination(IATA: string): Promise<void> {
    const destinationDoc = doc(this.firestore, 'destinations', IATA).withConverter(destinationConverter);
    return deleteDoc(destinationDoc).then(() => {
      console.log(`Destination with IATA ${IATA} deleted successfully!`);
    });
  }

  /**
   * Get a single destination by its IATA code.
   */
  public getDestinationByIATA(IATA: string): Promise<Destination | undefined> {
    const destinationDoc = doc(this.firestore, 'destinations', IATA).withConverter(destinationConverter);
    return getDoc(destinationDoc)
      .then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.data();
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
}
