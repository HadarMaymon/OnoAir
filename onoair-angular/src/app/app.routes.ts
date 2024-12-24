import { Routes } from '@angular/router';
import { LastMinuteFlightComponent } from './features/flights/last-minute-flight/last-minute-flight.component';
import { FindAFlightComponent } from './features/flights/find-a-flight/find-a-flight.component';
import { HomepageComponent } from './shared/homepage/homepage.component';
import { ManageFlightComponent} from './features/flights/manage-flight/manage-flight.component';
import { EditFlightComponent } from './features/flights/edit-flight/edit-flight.component';
import { ManageDestinationComponent } from './features/destinations/manage-destinations/manage-destinations.component';
import { EditDestinationsComponent } from './features/destinations/edit-destinations/edit-destinations.component';
import { BookAFlightComponent } from './features/booking/book-a-flight/book-a-flight.component';
import { MyBookingsComponent } from './features/booking/my-bookings/my-bookings.component';
import { MyBookingsDetailsComponent } from './features/booking/my-bookings-details/my-bookings-details.component';


export const routes: Routes = [
  { path: 'homepage', component: HomepageComponent },
  { path: '', redirectTo: 'last-minute-flight', pathMatch: 'full' },
  { path: 'last-minute-flight', component: LastMinuteFlightComponent },
  { path: 'find-a-flight', component: FindAFlightComponent },
  { path: 'manage-flight', component: ManageFlightComponent },  
  { path: 'edit-flight/:flightNumber', component: EditFlightComponent },
  { path: 'manage-destinations', component: ManageDestinationComponent },
  { path: 'edit-destinations/:destinationName', component: EditDestinationsComponent },
  { path: 'book-a-flight/:flightNumber', component: BookAFlightComponent },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: 'my-bookings-details/:bookingId', component: MyBookingsDetailsComponent},
  { path: '**', redirectTo: 'last-minute-flight' }
];