import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Firestore, collection, doc, setDoc, getDocs, onSnapshot, getDoc, deleteDoc } from '@angular/fire/firestore';
import { DestinationsService } from '../../destinations/service/destinations.service';
import { Flight } from '../model/flight';
import { Destination } from '../../destinations/models/destination';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private flightsSubject = new BehaviorSubject<Flight[]>([]);
  flights$ = this.flightsSubject.asObservable();

  private flights: Flight[] = [
    new Flight('ON1234', 'Paris', 'Berlin', '29/3/2025', '10:30 AM', '1h 50m', 200, '', 10, false),
    new Flight('ON5678', 'London', 'Dublin', '31/3/2025', '2:00 PM', '1h 20m', 150, '', 3, false),
    new Flight('ON9101', 'Tel Aviv', 'Paris', '', '5:00 PM', '4h 30m', 300, '', 7, true),
    new Flight('ON1213', 'Los Angeles', 'Bora Bora', '', '9:00 AM', '8h 20m', 800, '', 27, true),
    new Flight('ON1415', 'Tokyo', 'Los Angeles', '', '11:00 AM', '12h 10m', 600, '', 15, true),
    new Flight('ON1617', 'San Francisco', 'New York', '28/2/2025', '7:30 AM', '6h 15m', 350, '', 5, false),
    new Flight('ON1819', 'Beijing', 'Pyongyang', '', '3:00 PM', '2h 0m', 250, '', 9, true),
    new Flight('ON2021', 'Chicago', 'San Francisco', '15/10/2025', '4:00 PM', '4h 30m', 300, '', 7, false),
    new Flight('ON2223', 'Singapore', 'Thailand', '', '12:30 PM', '2h 10m', 200, 'https://t4.ftcdn.net/jpg/00/98/44/37/360_F_98443741_G8VlrLoRGWUSA3cGgw36RqEiBkfVR9pX.jpg', 11, true),
    new Flight('ON2425', 'Sydney', 'Tokyo', '', '10:00 PM', '9h 40m', 700, '', 19, true),
  ];

  constructor(
    private firestore: Firestore,
  ) {}

  /**
   * Sync flights with destination images from Firestore in real-time
   */
  syncFlightsWithImages(): void {
    const flightCollection = collection(this.firestore, 'flights');
    onSnapshot(flightCollection, async (snapshot) => {
      const flights = snapshot.docs.map((doc) => doc.data() as Flight);
  
      // Fetch destination images and map them to flights
      const destinations = await this.getAllDestinations();
      flights.forEach((flight) => {
        // Keep the existing image if already set
        if (!flight.image || flight.image === '') {
          const destination = destinations.find((d) => d.destinationName === flight.destination);
          flight.image = destination?.image || 'https://via.placeholder.com/300'; // Use destination image or fallback
        }
      });
  
      this.flightsSubject.next(flights);
    });
  }
  

  /**
   * Upload static flights to Firestore
   */
  uploadStaticFlights(): Promise<void> {
    const flightCollection = collection(this.firestore, 'flights');

    const uploadPromises = this.flights.map((flight) => {
      if (flight.isDynamicDate) {
        const newDate = this.getFutureDate(1, 30); // Random future date between 1 and 30 days
        flight.assignDynamicDate(newDate);
      }

      const flightDoc = doc(flightCollection, flight.flightNumber);
      return setDoc(flightDoc, { ...flight }).catch((error) => {
        console.error(`Error uploading flight ${flight.flightNumber}:`, error);
      });
    });

    return Promise.all(uploadPromises)
      .then(() => console.log('All static flights uploaded successfully!'))
      .catch((error) => console.error('Error uploading static flights:', error));
  }

  /**
   * Get a single flight by its flight number
   */
  getFlightByNumber(flightNumber: string): Promise<Flight | undefined> {
    const flightDoc = doc(this.firestore, 'flights', flightNumber);

    return getDoc(flightDoc)
      .then((snapshot) => (snapshot.exists() ? (snapshot.data() as Flight) : undefined))
      .catch((error) => {
        console.error(`Error fetching flight ${flightNumber}:`, error);
        return undefined;
      });
  }

  /**
   * Add a new flight to Firestore
   */
  addFlight(flight: Flight): Promise<void> {
    const flightCollection = collection(this.firestore, 'flights');
    const flightDoc = doc(flightCollection, flight.flightNumber);
    return setDoc(flightDoc, { ...flight }).then(() => {
      console.log(`Flight ${flight.flightNumber} added successfully!`);
    });
  }

  /**
   * Update an existing flight in Firestore
   */
  updateFlight(flight: Flight): Promise<void> {
    const flightCollection = collection(this.firestore, 'flights');
    const flightDoc = doc(flightCollection, flight.flightNumber);
    return setDoc(flightDoc, flight).catch((error) => {
      console.error(`Error updating flight ${flight.flightNumber}:`, error);
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
   * Fetch all destinations from Firestore
   */
  private async getAllDestinations(): Promise<Destination[]> {
    const destinationCollection = collection(this.firestore, 'destinations');
    const destinationSnapshot = await getDocs(destinationCollection);
    return destinationSnapshot.docs.map((doc) => doc.data() as Destination);
  }

  /**
   * Generate a random future date
   */
  private getFutureDate(minDays: number, maxDays: number): string {
    const today = new Date();
    const randomDaysToAdd = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
    today.setDate(today.getDate() + randomDaysToAdd);
    return today.toLocaleDateString('en-GB'); // Format as dd/MM/yyyy
  }
}
