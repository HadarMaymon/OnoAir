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
    returnDate: '',
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
      this.dataSource = new MatTableDataSource(flights);
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
    const { from, to, departureDate, returnDate, passengers } = this.filters;
  
    // Get today's date without time for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds, and milliseconds
  
    this.flightService.flights$.subscribe((flights) => {
      const filteredFlights = flights.filter((flight) => {
        // Parse the flight date to compare with today
        const flightDate = new Date(flight.date);
  
        // Exclude past flights
        if (flightDate < today) {
          return false;
        }
  
        // Apply other filters
        const matchesFrom = !from || flight.origin === from;
        const matchesTo = !to || flight.destination === to;
        const matchesDeparture = !departureDate || flight.date === departureDate;
        const matchesReturn = !returnDate || flight.arrivalDate === returnDate;
        const matchesPassengers = !passengers || flight.availableSeats >= passengers;
  
        return matchesFrom && matchesTo && matchesDeparture && matchesReturn && matchesPassengers;
      });
  
      this.dataSource.data = filteredFlights;
    });
  }
  
  bookFlight(flight: Flight): void {
    this.router.navigate(['/book-a-flight', flight.flightNumber]);
  }
}
