import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FlightService } from '../../service/flights.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // ✅ Corrected
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Flight } from '../../model/flight';
import { FlightStatus } from '../../model/flight-status.enum';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-find-a-flight',
  templateUrl: './find-a-flight.component.html',
  styleUrls: ['./find-a-flight.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule, // ✅ Only one import needed
    MatOption,
    MatSelectModule,
    ReactiveFormsModule,
  ],
})

export class FindAFlightComponent implements OnInit, AfterViewInit {
  filterForm!: FormGroup; 
  displayedColumns: string[] = [
    'flightNumber',
    'origin',
    'destination',
    'date',
    'departureTime',
    'arrivalDate',
    'arrivalTime',
    'price',
    'availableSeats',
    'actions',
  ];
  dataSource!: MatTableDataSource<Flight>;
  destinations$: Observable<any[]>;
  destinationNames: string[] = [];
  today: Date = new Date(); // ✅ Store today's date

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private flightService: FlightService,
    private router: Router,
    private firestore: Firestore,
    private fb: FormBuilder,
  ) {
    this.today.setHours(0, 0, 0, 0); // ✅ Normalize to midnight

    // Fetch destinations from Firestore
    const destinationsCollection = collection(this.firestore, 'destinations');
    this.destinations$ = collectionData(destinationsCollection, { idField: 'id' });

    // Extract destination names from the collection
    this.destinations$.subscribe((destinations) => {
      this.destinationNames = destinations.map((destination) => destination.destinationName).sort();
    });
  }

  disablePastDates = (date: Date | null): boolean => {
    if (!date) return false;
    return date >= this.today; // ✅ Disables past dates
  };

  ngOnInit(): void {
    // ✅ Initialize filterForm
    this.filterForm = this.fb.group({
      from: [''],
      to: [''],
      departureStartDate: [null],
      departureEndDate: [null],
      priceBudget: [null],
      passengers: [null],
    });

    // ✅ Prevent users from selecting past dates
    this.filterForm.get('departureStartDate')?.valueChanges.subscribe((selectedDate) => {
      if (selectedDate && new Date(selectedDate) < this.today) {
        this.filterForm.patchValue({ departureStartDate: null });
        alert("You cannot select a past departure date.");
      }
    });

    this.filterForm.get('departureEndDate')?.valueChanges.subscribe((selectedDate) => {
      if (selectedDate && new Date(selectedDate) < this.today) {
        this.filterForm.patchValue({ departureEndDate: null });
        alert("You cannot select a past return date.");
      }
    });

    // ✅ Fetch active flights
    this.flightService.flights$.subscribe((flights) => {
      const activeFlights = flights.filter((flight) => flight.status === FlightStatus.Active);
      this.dataSource = new MatTableDataSource(activeFlights);

      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilters(): void {
    const { from, to, departureStartDate, departureEndDate, priceBudget, passengers } = this.filterForm.value;
  
    // Get today's date at midnight for accurate comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    // Convert user-selected dates
    const startDate = departureStartDate ? new Date(departureStartDate) : undefined;
    const endDate = departureEndDate ? new Date(departureEndDate) : undefined;
  
    console.log("🔎 Search Triggered");
    console.log("From:", from, "To:", to);
    console.log("Start Date:", startDate, "End Date:", endDate);
  
    if (!startDate && !endDate) {
      alert("No dates were selected. Please select a departure date range.");
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      alert("The end date must be later than or equal to the start date.");
      return;
    }
  
    this.flightService.getFlightsByDateRange(startDate || today, endDate || new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())).subscribe(
      (flights) => {
        console.log("📡 Flights Fetched:", flights);
  
        const filteredFlights = flights.filter((flight) => {
          let flightDate: Date;
          
          if (flight.date instanceof Timestamp) {
            flightDate = flight.date.toDate();
          } else if (flight.date instanceof Date) {
            flightDate = flight.date;
          } else {
            console.warn("⚠️ Unexpected date format:", flight.date);
            return false;
          }
  
          flightDate.setHours(0, 0, 0, 0);

          const isInRange =
            (!startDate || flightDate >= startDate) &&
            (!endDate || flightDate <= endDate);

          const matchesFrom = !from || flight.origin.toLowerCase() === from.toLowerCase();
          const matchesTo = !to || flight.destination.toLowerCase() === to.toLowerCase();
          const matchesPrice = !priceBudget || flight.price <= priceBudget;
          const matchesPassengers = !passengers || flight.availableSeats >= passengers;

          return isInRange && matchesFrom && matchesTo && matchesPrice && matchesPassengers;
        });

        console.log("✅ Filtered Flights:", filteredFlights);

        if (filteredFlights.length === 0) {
          alert("No flights were found for the selected date range.");
        }

        this.dataSource.data = filteredFlights;
      },
      (error) => {
        console.error("❌ Firebase Query Error:", error);
      }
    );
  }
  
  bookFlight(flight: Flight): void {
    this.router.navigate(['/book-a-flight', flight.flightNumber]);
  }
}
