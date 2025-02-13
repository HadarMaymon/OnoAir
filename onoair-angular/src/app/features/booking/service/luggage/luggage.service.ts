import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Luggage } from '../../models/luggage';
import { Firestore, Timestamp, collection, doc, getDoc, onSnapshot, setDoc } from '@angular/fire/firestore';
import { Passenger
  
 } from '../../models/passenger';
@Injectable({
  providedIn: 'root'
})
export class LuggageService {
  private luggageData = new BehaviorSubject<{ [passengerId: string]: Luggage }>({});
  luggageData$ = this.luggageData.asObservable();
  luggageService: any;
  bookingsSubject: any;

  constructor(private firestore: Firestore) {}

  /**
   * Updates luggage data in memory and Firestore.
   */
  async updateLuggage(passengerId: string, bookingId: string, luggage: Luggage) {
    const currentData = this.luggageData.getValue();
    currentData[passengerId] = luggage;
    this.luggageData.next(currentData);

    //Update Firestore
    await this.saveLuggageToFirestore(passengerId, bookingId, luggage);
  }

  /**
   * Retrieves luggage data from memory or Firestore.
   */
  async getLuggage(passengerId: string, bookingId: string): Promise<Luggage> {
    try {
      const docRef = doc(this.firestore, `bookings/${bookingId}`);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const bookingData = snapshot.data();
        const passenger = bookingData['passengers'].find((p: Passenger) => p.id === passengerId);
        return passenger?.luggage || new Luggage(); // ✅ Ensure Luggage object
      }
    } catch (error) {
      console.error(`Error fetching luggage for passenger ${passengerId}:`, error);
    }
    return new Luggage(); // ✅ Default to avoid undefined errors
  }

  /**
   * Saves luggage data to Firestore.
   */
  private async saveLuggageToFirestore(passengerId: string, bookingId: string, luggage: Luggage) {
    try {
      const bookingDoc = doc(this.firestore, `bookings/${bookingId}`);
      const snapshot = await getDoc(bookingDoc);

      if (snapshot.exists()) {
        const bookingData = snapshot.data();
        const updatedPassengers = bookingData['passengers'].map((p: any) =>
          p.id === passengerId ? { ...p, luggage } : p
        );

        await setDoc(bookingDoc, { ...bookingData, passengers: updatedPassengers }, { merge: true });
      }
    } catch (error) {
      console.error(`Error saving luggage for passenger ${passengerId}:`, error);
    }
  }

  /**
   * ✅ Retrieves luggage data from Firestore.
   */
  private async getLuggageFromFirestore(passengerId: string, bookingId: string): Promise<Luggage> {
    try {
      const bookingDoc = doc(this.firestore, `bookings/${bookingId}`);
      const snapshot = await getDoc(bookingDoc);

      if (snapshot.exists()) {
        const bookingData = snapshot.data();
        const passenger = bookingData['passengers'].find((p: any) => p.id === passengerId);
        return passenger?.luggage || { cabin: 0, checked: 0, heavy: 0 }; // Default luggage if missing
      }
    } catch (error) {
      console.error(`Error retrieving luggage for passenger ${passengerId}:`, error);
    }
    return { cabin: 0, checked: 0, heavy: 0 }; // Default if error occurs
  }
}
