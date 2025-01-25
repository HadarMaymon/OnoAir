import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../service/flights.service';
import { MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { Flight } from '../../model/flight';

@Component({
  selector: 'app-manage-flight',
  templateUrl: './manage-flight.component.html',
  styleUrls: ['./manage-flight.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSort,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    MatSortModule,
    RouterModule,
  ],
})
export class ManageFlightComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'flightNumber',
    'origin',
    'destination',
    'date',
    'departureTime',
    'duration',
    'price',
    'availableSeats',
    'actions',
  ];
  dataSource!: MatTableDataSource<Flight>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    // Load flights from Firestore and populate the table
    this.flightService.syncFlightsWithImages(); // Start real-time sync
    this.flightService.flights$.subscribe((flights) => {
      this.dataSource = new MatTableDataSource(flights);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSource.sortingDataAccessor = (item, property) => {
        if (property === 'date') {
          return this.parseDate(item.date);
        }
        return (item as any)[property] || '';
      };
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editFlight(flight: Flight): void {
    console.log('Editing flight:', flight);
    // Example: Navigate to an edit flight page
    // You can implement an edit form and pass flight details via a route
  }

  deleteFlight(flight: Flight): void {
    if (confirm(`Are you sure you want to delete flight ${flight.flightNumber}?`)) {
      this.flightService.deleteFlight(flight.flightNumber).then(() => {
        console.log(`Flight ${flight.flightNumber} deleted successfully.`);
      }).catch((error) => {
        console.error(`Failed to delete flight ${flight.flightNumber}:`, error);
      });
    }
  }

  private parseDate(dateStr: string): number {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day).getTime();
  }
}
