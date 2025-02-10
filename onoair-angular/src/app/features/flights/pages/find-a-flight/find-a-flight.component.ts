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
import { FlightStatus

 } from '../../model/flight-status.enum';
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

  ],
})
export class FindAFlightComponent implements OnInit, AfterViewInit {
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

  destinations$: Observable<any[]>; // Observable for destinations
  destinationNames: string[] = []; // To store the extracted destination names

  filters = {
    from: '',
    to: '',
    departureDate: '',
    priceBudget: null,
    passengers: null,
  };

  today: Date = new Date(); // Current date for min in date picker


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private flightService: FlightService,
    private router: Router,
    private firestore: Firestore // Firestore instance
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
      this.flightService.flights$.subscribe((flights) => {
        // ✅ Filter only Active flights
        const activeFlights = flights.filter(flight => flight.status === FlightStatus.Active);
    
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
    const { from, to, departureDate, priceBudget, passengers } = this.filters;
  
    // Get today's date at midnight for accurate comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    this.flightService.flights$.subscribe((flights) => {
      const filteredFlights = flights.filter((flight) => {
        if (!flight.date) return false; // Skip flights with missing date
  
        // ✅ flight.date is already a Date object, so no need to convert it
        const flightDate = new Date(flight.date);
        flightDate.setHours(0, 0, 0, 0); // Ensure same time for comparison
  
        console.log(
          `Flight: ${flight.flightNumber}, Flight Date: ${flightDate.toLocaleDateString()}, Today: ${today.toLocaleDateString()}`
        ); // Debugging
  
        // ✅ Ensure flight is in the future or today
        if (flightDate < today) {
          console.warn(`Filtering out past flight: ${flight.flightNumber}`);
          return false;
        }
  
        // ✅ Ensure flight is Active
        if (flight.status !== FlightStatus.Active) {
          console.warn(`Filtering out inactive flight: ${flight.flightNumber}`);
          return false;
        }
  
        // ✅ Convert `departureDate` to Date (if provided)
        const isDepartureMatch =
          !departureDate || new Date(departureDate).toDateString() === flightDate.toDateString();
  
        // ✅ Apply filters
        const matchesFrom = !from || flight.origin === from;
        const matchesTo = !to || flight.destination === to;
        const matchesPrice = !priceBudget || flight.price <= priceBudget;
        const matchesPassengers = !passengers || flight.availableSeats >= passengers;
  
        return matchesFrom && matchesTo && isDepartureMatch && matchesPrice && matchesPassengers;
      });
  
      this.dataSource.data = filteredFlights;
    });
  }
  
  
    
  bookFlight(flight: Flight): void {
    this.router.navigate(['/book-a-flight', flight.flightNumber]);
  }
}
