import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Firestore, collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, getDoc, collectionData } from '@angular/fire/firestore';
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

  public syncDestinations(): void {
    const destinationCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
    onSnapshot(destinationCollection, (snapshot) => {
      const destinations = snapshot.docs.map((doc) => doc.data());
      this.destinationsSubject.next(destinations);
    });
  }

 
  public getAllDestinations(): Promise<Destination[]> {
    const destinationCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
    return getDocs(destinationCollection)
      .then((snapshot) => snapshot.docs.map((doc) => doc.data()))
      .catch((error) => {
        console.error('Error fetching all destinations:', error);
        return [];
      });
  }
  

  getAllDestinationNames(): Observable<string[]> {
    const destinationsRef = collection(this.firestore, 'destinations').withConverter(destinationConverter); // Get the 'destinations' collection reference with converter
    return collectionData(destinationsRef).pipe(
      map((destinations: Destination[]) => destinations.map((d) => d.destinationName))
    );
  }
  

  public addDestination(destination: Destination): Promise<void> {
    if (!destination.IATA) {
      console.error("⚠️ Error: IATA Code is required for adding a new destination.");
      return Promise.reject("IATA Code is required");
    }
  
    const destinationCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
    const destinationDoc = doc(destinationCollection, destination.IATA); // Use IATA as document ID
  
    return setDoc(destinationDoc, destination)
      .then(() => {
        console.log(`✅ Destination ${destination.destinationName} added successfully.`);
      })
      .catch((error) => {
        console.error(`❌ Error adding destination:`, error);
        throw error;
      });
  }
  

  public updateDestination(destination: Destination): Promise<void> {
    const destinationCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
    const destinationDoc = doc(destinationCollection, destination.IATA); // Use IATA as document ID
    return setDoc(destinationDoc, destination).then(() => {
      console.log(`Destination ${destination.destinationName} updated successfully.`);
    });
  }





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
