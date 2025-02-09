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
import { RouterModule, Router } from '@angular/router';
import { Flight } from '../../model/flight';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { EditFlightComponent } from '../edit-flight/edit-flight.component';

@Component({
  selector: 'app-manage-flight',
  templateUrl: './manage-flight.component.html',
  styleUrls: ['./manage-flight.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    RouterModule,
    MatDialogModule,
    RouterModule,
    EditFlightComponent, // Import the EditFlightComponent
  ],
})
export class ManageFlightComponent implements OnInit, AfterViewInit {
  selectedFlightNumber: string | null = null; // Holds the flight number to edit

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
    'status',
    'actions',
  ];
  
  dataSource!: MatTableDataSource<Flight>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private flightService: FlightService, private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    // Load flights into the table
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

  /** ✅ Updated: Open the EditFlightComponent instead of a confirmation dialog */
  editFlight(flightNumber: string): void {
    this.selectedFlightNumber = flightNumber; // Set the flight number for editing
    this.router.navigate(['../edit-flight', flightNumber]); // Navigate to the edit page
  }

  confirmDelete(flight: Flight): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { type: 'delete', name: `flight ${flight.flightNumber} to ${flight.destination}` },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.confirmed && result.action === 'delete') {
        this.flightService.deleteFlight(flight.flightNumber).then(() => {
          alert(`Flight ${flight.flightNumber} deleted successfully.`);
        }).catch((error) => {
          console.error(`Error deleting flight ${flight.flightNumber}:`, error);
          alert('Failed to delete flight. Please try again.');
        });
      }
    });
  }

  private parseDate(dateStr: string): number {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day).getTime();
  }
}
