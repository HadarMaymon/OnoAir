import { Component } from '@angular/core';
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import { HomepageComponent } from './shared/homepage/homepage.component';
import { HeaderComponent } from "./shared/header/header.component";
import { LastMinuteFlightComponent } from "./features/flights/last-minute-flight/last-minute-flight.component";
import { FindAFlightComponent } from './features/flights/find-a-flight/find-a-flight.component';
import { ManageFlightComponent } from './features/flights/manage-flight/manage-flight.component';
import { ManageDestinationComponent } from './features/destinations/manage-destinations/manage-destinations.component';
import { EditDestinationsComponent } from './features/destinations/edit-destinations/edit-destinations.component';
import { BookAFlightComponent } from './features/booking/book-a-flight/book-a-flight.component';
import { MyBookingsComponent } from './features/booking/my-bookings/my-bookings.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [MatMenuModule, MatButtonModule, HomepageComponent, HeaderComponent, LastMinuteFlightComponent, FindAFlightComponent,
    RouterOutlet, ManageFlightComponent, ManageDestinationComponent, EditDestinationsComponent, BookAFlightComponent, MyBookingsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'onoair-angular';
}
