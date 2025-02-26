import { Routes } from '@angular/router';
import { LastMinuteFlightComponent } from './features/flights/pages/last-minute-flight/last-minute-flight.component';
import { FindAFlightComponent } from './features/flights/pages/find-a-flight/find-a-flight.component';
import { HomepageComponent } from './features/home/homepage/homepage.component';
import { ManageFlightComponent} from './features/flights/pages/manage-flight/manage-flight.component';
import { EditFlightComponent } from './features/flights/pages/edit-flight/edit-flight.component';
import { ManageDestinationComponent } from './features/destinations/pages/manage-destinations/manage-destinations.component';
import { EditDestinationsComponent } from './features/destinations/pages/edit-destinations/edit-destinations.component';
import { BookAFlightComponent } from './features/booking/pages/book-a-flight/book-a-flight.component';
import { MyBookingsComponent } from './features/booking/pages/my-bookings/my-bookings.component';
import { MyBookingsDetailsComponent } from './features/booking/pages/my-bookings-details/my-bookings-details.component';
import { HelpPageComponent } from './features/help/help-page.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },  
  { path: 'homepage', component: HomepageComponent },  
  { path: 'last-minute-flight', component: LastMinuteFlightComponent },  
  { path: 'find-a-flight', component: FindAFlightComponent },
  { path: 'manage-flight', component: ManageFlightComponent },  
  { path: 'edit-flight/:flightNumber', component: EditFlightComponent },
  { path: 'manage-destinations', component: ManageDestinationComponent },
  { path: 'edit-destinations/:IATA', component: EditDestinationsComponent },
  { path: 'edit-destinations', component: EditDestinationsComponent },
  { path: 'book-a-flight/:flightNumber', component: BookAFlightComponent },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: 'my-bookings-details/:bookingId', component: MyBookingsDetailsComponent },
  { path: 'help', component: HelpPageComponent },
  { path: '**', redirectTo: '' } 
];
