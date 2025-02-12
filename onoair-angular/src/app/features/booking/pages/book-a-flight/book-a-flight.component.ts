import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../../../flights/service/flights.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Flight } from '../../../flights/model/flight';
import { Firestore, collection, getDoc, doc, getDocs, setDoc, Timestamp } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';

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
  passengers: { name: string; id: string }[] = [];
  errors: { name?: string; id?: string; duplicateId?: string }[] = []; // ✅ Add errors array
  destinationImage: string = '';

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService,
    private router: Router,
    private firestore: Firestore,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const flightNumber = this.route.snapshot.paramMap.get('flightNumber');
  
    if (flightNumber) {
      this.flightService.getFlightByNumber(flightNumber)
        .then((data) => {
          if (data) {
            this.flight = {
              ...data,
              date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date), // ✅ Convert timestamp to date
              arrivalDate: data.arrivalDate instanceof Timestamp ? data.arrivalDate.toDate() : new Date(data.arrivalDate), // ✅ Convert timestamp to date
              updatePrice: data.updatePrice,
              updateSeats: data.updateSeats,
              assignDynamicDate: data.assignDynamicDate,
              updateStatus: data.updateStatus
            };
            this.fetchDestinationImage(this.flight.destination);
          } else {
            this.redirectToFlightList();
          }
        })
        .catch(() => {
          this.redirectToFlightList();
        });
    }
  
    this.updatePassengers();
  }
  

  updatePassengers(): void {
    this.passengers = Array.from({ length: this.passengerCount }, () => ({ name: '', id: '' }));
    this.errors = Array(this.passengerCount).fill({});
  }

  validatePassenger(index: number): void {
    const passenger = this.passengers[index];
    this.errors[index] = {};

    // ✅ Validate Name (First and Last name only)
    const nameRegex = /^[A-Za-z]+ [A-Za-z]+$/;
    if (!nameRegex.test(passenger.name)) {
      this.errors[index].name = 'Enter first and last name (letters only)';
    }

    // ✅ Validate Passport ID (Exactly 9 digits)
    const idRegex = /^[0-9]{9}$/;
    if (!idRegex.test(passenger.id)) {
      this.errors[index].id = 'ID must be exactly 9 digits';
    }

    // ✅ Check for Duplicate Passport ID
    const idCounts = this.passengers.map((p) => p.id).filter((id) => id);
    if (idCounts.filter((id) => id === passenger.id).length > 1) {
      this.errors[index].duplicateId = 'Duplicate Passport ID found';
    }
  }

  hasErrors(): boolean {
    return this.errors.some((error) => Object.keys(error).length > 0);
  }

  async fetchDestinationImage(destination: string | undefined): Promise<void> {
    if (!destination) {
      this.destinationImage = 'assets/images/default.jpg';
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
      this.destinationImage = 'assets/images/default.jpg';
    }
  }

  async saveBooking(): Promise<void> {
    if (this.hasErrors()) {
      this.showErrorDialog('Please fix validation errors before saving.');
      return;
    }
  
    if (this.passengers.every((p) => p.name && p.id)) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: { type: 'save', name: 'this booking' },
      });
  
      const result = await dialogRef.afterClosed().toPromise();
  
      if (result?.confirmed) {
        try {
          let bookingId: string;
          do {
            const randomId = Math.floor(1000 + Math.random() * 9000);
            bookingId = `BK${randomId}`;
            const bookingDoc = doc(this.firestore, `bookings/${bookingId}`);
            const docSnapshot = await getDoc(bookingDoc);
            if (!docSnapshot.exists()) break;
          } while (true);
  
          const bookingData = {
            bookingId,
            id: bookingId,
            flightNumber: this.flight?.flightNumber || 'Unknown Flight',
            origin: this.flight?.origin || 'Unknown Origin',
            destination: this.flight?.destination || 'Unknown Destination',
            boarding: this.flight?.date ? Timestamp.fromDate(this.flight.date) : Timestamp.now(),
            departureTime: this.flight?.departureTime || '00:00', // ✅ Store departure time
            landing: this.flight?.arrivalDate ? Timestamp.fromDate(this.flight.arrivalDate) : Timestamp.now(),
            arrivalTime: this.flight?.arrivalTime || '00:00', // ✅ Store arrival time
            numberOfPassengers: this.passengers.length,
            passengers: this.passengers.map((p) => ({ name: p.name, id: p.id })),
            image: '',
            isDynamicDate: true,
            status: 'Active',
          };
  
          const bookingDoc = doc(this.firestore, `bookings/${bookingId}`);
          await setDoc(bookingDoc, bookingData);
  
          this.router.navigate(['/homepage']);
        } catch (error) {
          console.error('Error saving booking:', error);
          this.showErrorDialog('An error occurred while saving the booking. Please try again.');
        }
      }
    } else {
      this.showErrorDialog('Please fill in all passenger details.');
    }
  }
  
  redirectToFlightList(): void {
    this.router.navigate(['/find-a-flight']);
  }

  private showErrorDialog(message: string): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'Error', message, showCloseButton: true },
    });
  }

}
