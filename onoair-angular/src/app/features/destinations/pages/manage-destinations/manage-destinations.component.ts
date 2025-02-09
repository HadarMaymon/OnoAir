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

@Component({
  selector: 'app-manage-destinations',
  templateUrl: './manage-destinations.component.html',
  styleUrls: ['./manage-destinations.component.css'],
  standalone: true,
  imports: [
    RouterLink,
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

  constructor(
    private destinationService: DestinationsService,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.destinationService.syncDestinations();
    this.destinationService.destinations$.subscribe({
      next: (destinations) => {
        console.log('Fetched Destinations:', destinations);
        destinations.forEach(dest => console.log(`Destination: ${dest.destinationName}, Status: ${dest.status}`));
        
        this.dataSource.data = destinations;
        this.cdr.detectChanges(); // ✅ Force UI update to show status
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

  /**
   * Convert status enum to user-friendly text.
   */
  getStatusLabel(status: DestinationStatus): string {
    const statusLabels: Record<DestinationStatus, string> = {
      [DestinationStatus.Active]: 'Active',
      [DestinationStatus.Canceled]: 'Canceled',
    };

    return statusLabels[status] || 'Unknown'; // Default fallback
  }

  /**
   * Apply filter to table based on search input.
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Navigate to the edit destination page with the given IATA code.
   */
  editDestination(IATA: string): void {
    this.router.navigate(['/edit-destination', IATA]);
  }

  /**
   * Navigate to the add destination form (empty form).
   */
  addDestination(): void {
    this.router.navigate(['/edit-destination']);
  }

  /**
   * Confirm and delete a destination.
   */
  confirmDelete(destination: Destination): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { type: 'delete', name: `destination ${destination.IATA}` },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.confirmed && result.action === 'delete') {
        this.destinationService.deleteDestination(destination.IATA).then(() => {
          alert(`Destination ${destination.IATA} deleted successfully.`);
        }).catch((error) => {
          console.error(`Error deleting destination ${destination.IATA}:`, error);
          alert('Failed to delete destination. Please try again.');
        });
      }
    });
  }
}
