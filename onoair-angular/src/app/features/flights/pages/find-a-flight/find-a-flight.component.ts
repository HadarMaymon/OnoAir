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
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Flight } from '../../model/flight';

@Component({
  selector: 'app-find-a-flight',
  templateUrl: './find-a-flight.component.html',
  styleUrls: ['./find-a-flight.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private flightService: FlightService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to real-time flights data
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

      // Custom sorting logic for date fields
      this.dataSource.sortingDataAccessor = (item, property) => {
        if (property === 'date' || property === 'arrivalDate') {
          return this.parseDate(item[property]);
        }
        return (item as any)[property];
      };
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  bookFlight(flight: Flight): void {
    // Navigate to booking page with the selected flight's number
    this.router.navigate(['/book-a-flight', flight.flightNumber]);
  }

  private parseDate(dateStr: string): number {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day).getTime();
  }
}
