import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DestinationsService } from '../../service/destinations.service';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Destination } from '../../models/destination';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { DestinationStatus } from '../../models/destination-status.enum';
import { ChangeDetectorRef } from '@angular/core';
import { EditDestinationsComponent } from '../edit-destinations/edit-destinations.component';
import { FlightService} from '../../../flights/service/flights.service';

@Component({
  selector: 'app-manage-destinations',
  templateUrl: './manage-destinations.component.html',
  styleUrls: ['./manage-destinations.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    MatSort,
    MatPaginator,
    MatIconModule,
  ],
})
export class ManageDestinationComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<Destination>();
  displayedColumns: string[] = [
    'destinationName',
    'airportName',
    'IATA',
    'timeZone',
    'currency',
    'status',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedDestination: Destination | null = null; // Store selected destination

  constructor(
    private destinationService: DestinationsService,
    private flightService: FlightService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.destinationService.syncDestinations();
    this.destinationService.destinations$.subscribe({
      next: (destinations) => {
        this.dataSource.data = destinations;
      },
      error: () => {
        alert('Failed to sync destinations.');
      },
    });
  }

  

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Opens the edit form with the selected destination
   */
  editDestination(destination: Destination): void {
    this.router.navigate(['/edit-destinations', destination.IATA], {
      state: { destination }, 
    });
  }
  
  addDestination(): void {
    this.router.navigate(['/edit-destinations'], {
      state: { destination: null }, 
    });
  }
  
  /**
   * Confirm and delete a destination.
   */
  confirmDelete(destination: Destination): void {
    // Step 1: Open delete confirmation dialog first
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { type: 'delete', name: `destination ${destination.IATA}` },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.confirmed && result.action === 'delete') {
        
        // Step 2: Check for active flights only if user confirmed deletion
        this.flightService.getActiveFlightsForDestination(destination.destinationName)
          .then((activeFlights) => {
            if (activeFlights.length > 0) {
              // Step 3: Open error dialog if there are active flights
              const errorDialogRef = this.dialog.open(ConfirmDialogComponent, {
                width: '350px',
                data: {
                  type: 'error',
                  name: `Cannot delete destination ${destination.IATA}`,
                  alertMessage: `There are ${activeFlights.length} active flights associated with this destination. Please remove them first.`,
                },
              });
  
              return; // Stop execution if active flights exist
            }
  
            // Step 4: If no active flights exist, delete the destination
            this.destinationService.deleteDestination(destination.IATA)
              .then(() => {
                // Step 5: Open success dialog instead of alert
                this.dialog.open(ConfirmDialogComponent, {
                  width: '350px',
                  data: {
                    type: 'success',
                    name: `Destination Deleted`,
                    alertMessage: `Destination ${destination.IATA} has been successfully deleted.`,
                  },
                });
              })
              .catch((error) => {
                console.error(`Error deleting destination ${destination.IATA}:`, error);
                alert('Failed to delete destination.');
              });
  
          })
          .catch((error) => {
            console.error(`Error checking active flights for ${destination.IATA}:`, error);
            alert('Failed to check for active flights.');
          });
      }
    });
  }  
  
}
