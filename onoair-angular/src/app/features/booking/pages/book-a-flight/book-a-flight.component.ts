import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../../../flights/service/flights.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Flight } from '../../../flights/model/flight';
import { Firestore, collection, addDoc, getDoc, doc, getDocs, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-book-a-flight',
  templateUrl: './book-a-flight.component.html',
  styleUrls: ['./book-a-flight.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class BookAFlightComponent implements OnInit {
  flight: Flight | null = null;
  passengerCount: number = 1; // Default number of passengers
  passengers: { name: string; id: string }[] = []; // Array to hold passenger details
  destinationImage: string = ''; // Destination image URL

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService,
    private router: Router,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    const flightNumber = this.route.snapshot.paramMap.get('flightNumber');

    if (flightNumber) {
      this.flightService.getFlightByNumber(flightNumber)
        .then((data) => {
          if (data) {
            this.flight = data;
            this.fetchDestinationImage(this.flight.destination); // Fetch the destination image
          } else {
            this.redirectToFlightList();
          }
        })
        .catch(() => {
          this.redirectToFlightList();
        });
    }

    // Initialize the passenger form
    this.updatePassengers();
  }

  updatePassengers(): void {
    // Reset the passengers array based on the selected passenger count
    this.passengers = Array.from({ length: this.passengerCount }, () => ({
      name: '',
      id: '', // Changed from passportId to id
    }));
  }

  async fetchDestinationImage(destination: string | undefined): Promise<void> {
    if (!destination) {
      this.destinationImage = 'assets/images/default.jpg'; // Default image
      return;
    }

    try {
      const destinationDoc = doc(this.firestore, `destinations/${destination}`);
      const snapshot = await getDoc(destinationDoc);

      if (snapshot.exists()) {
        this.destinationImage = snapshot.data()?.['image'] || 'assets/images/default.jpg';
      } else {
        console.warn(`No image found for destination: ${destination}`);
        this.destinationImage = 'assets/images/default.jpg';
      }
    } catch (error) {
      console.error('Error fetching destination image:', error);
      this.destinationImage = 'assets/images/default.jpg'; // Default image on error
    }
  }

  async saveBooking(): Promise<void> {
    if (this.passengers.every((p) => p.name && p.id)) {
      try {
        // Generate a unique booking ID
        const bookingsCollection = collection(this.firestore, 'bookings');
        const snapshot = await getDocs(bookingsCollection);
        const bookingId = `BK${(snapshot.size + 1).toString().padStart(4, '0')}`; // Generate bookingId, e.g., BK0001
  
        // Ensure flight data is merged correctly
        const bookingData = {
          bookingId: bookingId, // Custom booking ID
          id: bookingId, // Ensure document "id" field matches bookingId
          origin: this.flight?.origin || 'Unknown Origin',
          destination: this.flight?.destination || 'Unknown Destination',
          boarding: `${this.flight?.date || 'Unknown Date'} ${this.flight?.departureTime || 'Unknown Time'}`,
          landing: `${this.flight?.arrivalDate || 'Unknown Date'} ${this.flight?.arrivalTime || 'Unknown Time'}`,
          numberOfPassengers: this.passengers.length,
          passengers: this.passengers.map((p) => ({
            name: p.name,
            id: p.id, // Store passenger ID
          })),
          image: '', // Image will be fetched
          isDynamicDate: true,
        };
  
        // Fetch the destination image if available
        if (this.flight?.destination) {
          const destinationDoc = doc(this.firestore, `destinations/${this.flight.destination}`);
          const destinationSnapshot = await getDoc(destinationDoc);
  
          if (destinationSnapshot.exists()) {
            bookingData.image = destinationSnapshot.data()?.['image'] || '';
          }
        }
  
        // Save the booking data to Firestore with the bookingId as the document ID
        const bookingDoc = doc(this.firestore, `bookings/${bookingId}`); // Explicit document ID
        await setDoc(bookingDoc, bookingData); // Save data with custom ID
  
        alert(`Booking saved successfully with ID: ${bookingId}!`);
        this.router.navigate(['/homepage']);
      } catch (error) {
        console.error('Error saving booking:', error);
        alert('An error occurred while saving the booking. Please try again.');
      }
    } else {
      alert('Please fill in all passenger details.');
    }
  }
  
  redirectToFlightList(): void {
    alert('Flight not found. Redirecting to Find A Flight.');
    this.router.navigate(['/find-a-flight']);
  }
}
