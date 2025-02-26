import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Luggage } from '../../models/luggage';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
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
            
            console.log(`Retrieved luggage for passenger ${passengerId}:`, passenger?.luggage);

            return passenger?.luggage ?? new Luggage(0, 0, 0); 
        } else {
            console.error(`Booking ${bookingId} not found`);
        }
    } catch (error) {
        console.error(` Error fetching luggage for passenger ${passengerId}:`, error);
    }
    return new Luggage(0, 0, 0); 
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
                p.id === passengerId
                    ? { ...p, luggage: { ...(p.luggage || {}), ...luggage } } 
                    : p
            );

            await setDoc(bookingDoc, { passengers: updatedPassengers }, { merge: true });
            console.log(` Luggage updated for passenger ${passengerId}`);
        } else {
            console.error(` Booking ${bookingId} not found`);
        }
    } catch (error) {
        console.error(`Error saving luggage for passenger ${passengerId}:`, error);
    }
}

}
