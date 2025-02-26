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
          return item.date instanceof Date ? item.date.getTime() : 0;
        }
        return (item as any)[property] || '';
      };
    }
  }
  

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editFlight(flightNumber: string): void {
    this.selectedFlightNumber = flightNumber; // Set the flight number for editing
    this.router.navigate(['../edit-flight', flightNumber]); // Navigate to the edit page
  }

  confirmDelete(flight: Flight): void {
    console.log(`Attempting to delete flight: ${flight.flightNumber}`);

    this.flightService.getFlightBookings(flight.flightNumber).then((hasActiveFutureBooking) => {
        console.log(`🛫 Flight ${flight.flightNumber} has active future bookings: ${hasActiveFutureBooking}`);

        // 🚨 Prevent deletion if at least ONE active future booking exists
        if (hasActiveFutureBooking) {
            console.warn(`❌ Cannot delete flight ${flight.flightNumber}: Active & future bookings exist.`);

            this.dialog.open(ConfirmDialogComponent, {
                width: '350px',
                data: {
                    type: 'error',
                    name: `Flight ${flight.flightNumber} has active future bookings and cannot be deleted.`,
                    showCancelButton: false,
                    showConfirmButton: true,
                    showCloseButton: true
                },
            });

            return; // Stop execution, flight can't be deleted
        }

        console.log(`✅ No active future bookings for flight ${flight.flightNumber}. Proceeding with deletion.`);

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: {
                type: 'delete',
                name: `Flight ${flight.flightNumber} to ${flight.destination}`,
                showCancelButton: true,
                showConfirmButton: true,
                showCloseButton: false,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(`🗑️ Delete Dialog closed. User confirmed delete: ${result?.confirmed}`);

            if (!result?.confirmed) {
                console.log(`❌ User canceled deletion of flight ${flight.flightNumber}.`);
                return;
            }

            console.log(`Deleting flight ${flight.flightNumber}...`);

            this.flightService.deleteFlight(flight.flightNumber).then(() => {
                console.log(`✅ Flight ${flight.flightNumber} deleted successfully.`);

                this.dialog.open(ConfirmDialogComponent, {
                    width: '350px',
                    data: {
                        type: 'success',
                        name: `Flight ${flight.flightNumber} deleted successfully.`,
                        showCancelButton: false,
                        showConfirmButton: false,
                        showCloseButton: true,
                    },
                });

            }).catch((error) => {
                console.error(`❌ Error deleting flight ${flight.flightNumber}:`, error);
                this.dialog.open(ConfirmDialogComponent, {
                    width: '350px',
                    data: {
                        type: 'error',
                        name: 'Failed to delete flight. Please try again.',
                        showCancelButton: false,
                        showConfirmButton: true,
                        showCloseButton: true,
                    },
                });
            });
        });
    }).catch((error) => {
        console.error(`❌ Error checking flight bookings for ${flight.flightNumber}:`, error);
        this.dialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: {
                type: 'error',
                name: 'Failed to check flight bookings. Please try again later.',
                showCancelButton: false,
                showConfirmButton: true,
                showCloseButton: true,
            },
        });
    });
}

}
