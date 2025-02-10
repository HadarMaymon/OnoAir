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
import { MatNativeDateModule } from '@angular/material/core';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Firestore, collectionData, collection } from '@angular/fire/firestore'; 
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Flight } from '../../model/flight';
import { FlightStatus} from '../../model/flight-status.enum';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';


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
    MatNativeDateModule, 
    MatOption,
    MatSelectModule,
    ReactiveFormsModule,
  
  ],
})

export class FindAFlightComponent implements OnInit, AfterViewInit {
  filterForm!: FormGroup; // ✅ Use non-null assertion operator (!)
  displayedColumns: string[] = [
    'flightNumber',
    'origin',
    'destination',
    'date',
    'departureTime',
    'duration',
    'arrivalDate',
    'arrivalTime',
    'price',
    'availableSeats',
    'actions',
  ];
  dataSource!: MatTableDataSource<Flight>;
  destinations$: Observable<any[]>;
  destinationNames: string[] = [];
  
  filters = {
    from: '',
    to: '',
    departureStartDate: '', 
    departureEndDate: '', 
    priceBudget: null,
    passengers: null,
  };
  

  today: Date = new Date(); // Current date for min in date picker


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private flightService: FlightService,
    private router: Router,
    private firestore: Firestore, // Firestore instance
    private fb: FormBuilder, // ✅ Inject FormBuilder

  ) {
    // Fetch destinations from Firestore
    const destinationsCollection = collection(this.firestore, 'destinations');
    this.destinations$ = collectionData(destinationsCollection, { idField: 'id' });

    // Extract destination names from the collection
    this.destinations$.subscribe((destinations) => {
      this.destinationNames = destinations.map((destination) => destination.destinationName).sort();
    });
  }

  ngOnInit(): void {
    // ✅ Initialize filterForm with controls
    this.filterForm = this.fb.group({
      from: [''],
      to: [''],
      departureStartDate: [null],
      departureEndDate: [null],
      priceBudget: [null],
      passengers: [null],
    });

    // Fetch active flights
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
  
    // Ensure the date range is valid
    const startDate = departureStartDate ? new Date(departureStartDate) : undefined;
    const endDate = departureEndDate ? new Date(departureEndDate) : undefined;
  
    if (startDate && endDate && startDate > endDate) {
      alert("End date must be later than or equal to the start date.");
      return;
    }
  
    this.flightService.flights$.subscribe((flights) => {
      const filteredFlights = flights.filter((flight) => {
        const flightDate = new Date(flight.date); // `flight.date` is a Date object
        flightDate.setHours(0, 0, 0, 0); // Normalize time for comparison
  
        const isInRange =
          (!startDate || flightDate >= startDate) &&
          (!endDate || flightDate <= endDate);
  
        const matchesFrom = !from || flight.origin === from;
        const matchesTo = !to || flight.destination === to;
        const matchesPrice = !priceBudget || flight.price <= priceBudget;
        const matchesPassengers = !passengers || flight.availableSeats >= passengers;
  
        return isInRange && matchesFrom && matchesTo && matchesPrice && matchesPassengers;
      });
  
      if (filteredFlights.length === 0) {
        alert("No flights found for the selected range. Try adjusting your filters.");
      }
  
      this.dataSource.data = filteredFlights;
    });
  }
  
  
    
  bookFlight(flight: Flight): void {
    this.router.navigate(['/book-a-flight', flight.flightNumber]);
  }
}
