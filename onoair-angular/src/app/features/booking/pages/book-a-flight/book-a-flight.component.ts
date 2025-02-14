import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../../../flights/service/flights.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Flight } from '../../../flights/model/flight';
import { Firestore, getDoc, doc, setDoc, Timestamp, collection } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { LuggageDialogComponent } from '../../dialog/luggage-dialog/luggage-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { LuggageService } from '../../service/luggage/luggage.service';
import { inject } from '@angular/core';


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
    MatStepperModule,
    MatIconModule, 
  ],
})
export class BookAFlightComponent implements OnInit {
  private firestore = inject(Firestore);
  flight: Flight | null = null;
  passengerCount: number = 1;
  passengers: { name: string; id: string; luggage: { cabin: number; checked: number; heavy: number } }[] = [];
  errors: { name?: string; id?: string; duplicateId?: string }[] = [];
  destinationImage: string = '';
  maxLuggageItems = 9;
  currentStep = 0;
  isSaving = false;

;

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService,
    private router: Router,
    private dialog: MatDialog,
    private luggageService: LuggageService
  ) {}


  setStep(index: number) {
    this.currentStep = index;
  }


  ngOnInit(): void {
    const flightNumber = this.route.snapshot.paramMap.get('flightNumber');

    if (flightNumber) {
      this.flightService.getFlightByNumber(flightNumber)
        .then((data) => {
          if (data) {
            this.flight = {
              ...data,
              date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
              arrivalDate: data.arrivalDate instanceof Timestamp ? data.arrivalDate.toDate() : new Date(data.arrivalDate),
              updatePrice: data.updatePrice,
              updateSeats: data.updateSeats,
              assignDynamicDate: data.assignDynamicDate,
              updateStatus: data.updateStatus,
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

  hasAtLeastOneValidPassenger(): boolean {
    return this.passengers.some(passenger => passenger.name.trim() !== '' && passenger.id.trim() !== '');
  }
  
  
  updatePassengers(): void {
    if (this.passengers.length < this.passengerCount) {
      // Add new passengers
      while (this.passengers.length < this.passengerCount) {
        this.passengers.push({ name: '', id: '', luggage: { cabin: 0, checked: 0, heavy: 0 } });
      }
    } else {
      // Remove extra passengers
      this.passengers = this.passengers.slice(0, this.passengerCount);
    }
  
    this.errors = this.passengers.map(() => ({}));
  }
  

  openLuggageDialog(passengerIndex: number): void {
    const dialogRef = this.dialog.open(LuggageDialogComponent, {
      width: '400px',
      data: { 
        passenger: { 
          name: this.passengers[passengerIndex].name, 
          luggage: { ...this.passengers[passengerIndex].luggage } 
        },
        maxLuggageItems: this.maxLuggageItems,
      }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const totalItems = result.cabin + result.checked + result.heavy;
  
        if (totalItems > this.maxLuggageItems) {
          this.showErrorDialog(`Luggage limit exceeded! Maximum allowed: ${this.maxLuggageItems}`);
        } else {
          console.log(`🛄 Updating luggage for passenger ${passengerIndex}:`, result);
          this.passengers[passengerIndex].luggage = result;
        }
      }
    });
  }
  
  

  /**
   *Validate passenger details
   */
  validatePassenger(index: number): void {
    const passenger = this.passengers[index];
    this.errors[index] = {};
  
    const nameRegex = /^[A-Za-z]+ [A-Za-z]+$/;
    if (!nameRegex.test(passenger.name)) {
      this.errors[index].name = 'Enter first and last name (letters only)';
    }
  
    const idRegex = /^[0-9]{9}$/;
    if (!idRegex.test(passenger.id)) {
      this.errors[index].id = 'ID must be exactly 9 digits';
    }
  
    const idCounts = this.passengers.map((p) => p.id).filter((id) => id);
    if (idCounts.filter((id) => id === passenger.id).length > 1) {
      this.errors[index].duplicateId = 'Duplicate Passport ID found';
    }
  }
  
  

  /**
   *Fetch Flight Destination Image
   */
  async fetchDestinationImage(destination: string | undefined): Promise<void> {
    if (!destination) {
      this.destinationImage = 'assets/images/default.jpg';
      return;
    }

    try {
      const destinationDoc = doc(this.firestore, `destinations/${destination}`);
      const snapshot = await getDoc(destinationDoc);

      this.destinationImage = snapshot.exists() ? snapshot.data()?.['image'] || 'assets/images/default.jpg' : 'assets/images/default.jpg';
    } catch (error) {
      console.error('Error fetching destination image:', error);
      this.destinationImage = 'assets/images/default.jpg';
    }
  }

  addPassenger(): void {
    this.passengers.push({ name: '', id: '', luggage: { cabin: 0, checked: 0, heavy: 0 } });
    this.errors.push({});
  }
  
  removePassenger(index: number): void {
    if (this.passengers.length > 1) {
      this.passengers.splice(index, 1);
      this.errors.splice(index, 1); // Remove errors for that passenger
    }
  }
  

  async saveBooking(): Promise<void> {
    if (this.hasErrors()) {
        this.showErrorDialog("Please fix validation errors before saving.");
        return;
    }

    if (this.passengers.every((p) => p.name && p.id)) {
        this.isSaving = true;  //Disable button while saving

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: "350px",
            data: { type: "save", name: "this booking" },
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

                console.log("Generated Booking ID:", bookingId);

                const passengersWithLuggage = this.passengers.map((p) => ({
                    name: p.name,
                    id: p.id,
                    luggage: {
                        cabin: p.luggage?.cabin ?? 0,
                        checked: p.luggage?.checked ?? 0,
                        heavy: p.luggage?.heavy ?? 0,
                    }
                }));

                console.log("Passengers Before Firestore Save:", JSON.stringify(passengersWithLuggage, null, 2));

                const bookingData = {
                    bookingId,
                    flightNumber: this.flight?.flightNumber || "Unknown Flight",
                    origin: this.flight?.origin || "Unknown",
                    destination: this.flight?.destination || "Unknown",
                    numberOfPassengers: passengersWithLuggage.length,
                    passengers: passengersWithLuggage,
                    boarding: Timestamp.fromDate(new Date(this.flight?.date || Date.now())),
                    landing: Timestamp.fromDate(new Date(this.flight?.arrivalDate || Date.now())),
                    departureTime: this.flight?.departureTime || "00:00", 
                    arrivalTime: this.flight?.arrivalTime || "00:00",     
                    image: this.destinationImage || 'assets/images/default-destination.jpg',
                    isDynamicDate: this.flight?.assignDynamicDate || false,
                    status: "Active",
                };

                console.log("🚀 Booking Data Before Firestore Save:", JSON.stringify(bookingData, null, 2));

                const bookingsCollection = collection(this.firestore, "bookings");
                await setDoc(doc(bookingsCollection, bookingId), bookingData, { merge: true });

                console.log(`Booking ${bookingId} saved successfully.`);

                //Redirect to "My Bookings" page after saving
                this.router.navigate(['/my-bookings']);
            } catch (error) {
                console.error("Firestore save failed:", error);
                const errorMessage = (error as Error).message;
                this.showErrorDialog(`Firestore error: ${errorMessage}`);
            } finally {
                this.isSaving = false; 
            }
        } else {
            this.isSaving = false;
        }
    } else {
        this.showErrorDialog("Please fill in all passenger details.");
    }
}

  /**
   * ✅ Error Dialog
   */
  private showErrorDialog(message: string): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'Error', message, showCloseButton: true },
    });
  }

  redirectToFlightList(): void {
    this.router.navigate(['/find-a-flight']);
  }

  hasErrors(): boolean {
    return this.errors.some((error) => Object.keys(error).length > 0);
  }
  
  canProceedToStep2(): boolean {
    return !this.hasErrors() && this.passengers.every((p) => p.name && p.id);
  }

  canProceedToStep3(): boolean {
    return this.hasAtLeastOneValidPassenger(); 
  }
  
}
