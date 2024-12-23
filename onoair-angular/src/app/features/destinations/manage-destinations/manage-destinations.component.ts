import { Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { DestinationsService, Destination } from '../../../service/destinations/destinations.service';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-manage-destinations',
  templateUrl: './manage-destinations.component.html',
  styleUrls: ['./manage-destinations.component.css'],
  imports:[
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
  displayedColumns: string[] = ['destinationName', 'airportName', 'IATA', 'timeZone', 'currency', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private destinationService: DestinationsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDestinations();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadDestinations(): void {
    this.destinationService.getDestinations().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: () => {
        alert('Failed to load destinations.');
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editDestination(destinationName: string): void {
    this.router.navigate(['/edit-destination', destinationName]);
  }


}
