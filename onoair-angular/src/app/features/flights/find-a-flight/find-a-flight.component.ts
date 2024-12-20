import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FlightService, Flight } from '../../../service/flights/flights';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-find-a-flight',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './find-a-flight.component.html',
  styleUrls: ['./find-a-flight.component.css'],
})
export class FindAFlightComponent implements OnInit, AfterViewInit {
  // Updated displayedColumns to include all fields
  displayedColumns: string[] = [
    'flightNumber',
    'origin',
    'destination',
    'date',
    'departureTime',
    'duration',
    'price',
    'actions',
  ];
  dataSource!: MatTableDataSource<Flight>;

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Paginator reference
  @ViewChild(MatSort) sort!: MatSort; // Sort reference

  constructor(private FlightService: FlightService) {}

  ngOnInit(): void {
    // Fetch data from the service
    const flights = this.FlightService.getAllFlights();
    this.dataSource = new MatTableDataSource(flights);
  }

  ngAfterViewInit(): void {
    // Assign paginator and sort after view initialization
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Custom sorting logic for the 'date' column
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'date') {
        return this.parseDate(item.date); // Parse date for proper sorting
      }
      return (item as any)[property];
    };

    // Set default sorting for the 'date' column
    this.sort.active = 'date';
    this.sort.direction = 'asc';
    this.sort.sortChange.emit();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  bookFlight(flight: Flight): void {
    alert(
      `You have booked flight ${flight.flightNumber} from ${flight.origin} to ${flight.destination} on ${flight.date} at ${flight.departureTime}`
    );
  }

  private parseDate(dateString: string): number {
    if (!dateString) {
      return 0; // Treat empty dates as the earliest possible value
    }
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day).getTime();
  }
}
