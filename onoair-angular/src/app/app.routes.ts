import { Routes } from '@angular/router';
import { LastMinuteFlightComponent } from './features/pages/flights/last-minute-flight/last-minute-flight.component';
import { FindAFlightComponent } from './features/pages/flights/find-a-flight/find-a-flight.component';
import { HomepageComponent } from './features/pages/home/homepage/homepage.component';
import { ManageFlightComponent} from './features/pages/flights/manage-flight/manage-flight.component';
import { EditFlightComponent } from './features/pages/flights/edit-flight/edit-flight.component';
import { ManageDestinationComponent } from './features/pages/destinations/manage-destinations/manage-destinations.component';
import { EditDestinationsComponent } from './features/pages/destinations/edit-destinations/edit-destinations.component';
import { BookAFlightComponent } from './features/pages/booking/book-a-flight/book-a-flight.component';
import { MyBookingsComponent } from './features/pages/booking/my-bookings/my-bookings.component';
import { MyBookingsDetailsComponent } from './features/pages/booking/my-bookings-details/my-bookings-details.component';
import { HelpPageComponent } from './features/pages/help/help-page/help-page.component'; 


export const routes: Routes = [
  { path: '', component: HomepageComponent },  
  { path: 'homepage', component: HomepageComponent },  
  { path: 'last-minute-flight', component: LastMinuteFlightComponent },  
  { path: 'find-a-flight', component: FindAFlightComponent },
  { path: 'manage-flight', component: ManageFlightComponent },  
  { path: 'edit-flight/:flightNumber', component: EditFlightComponent },
  { path: 'manage-destinations', component: ManageDestinationComponent },
  { path: 'edit-destinations/:destinationName', component: EditDestinationsComponent },
  { path: 'book-a-flight/:flightNumber', component: BookAFlightComponent },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: 'my-bookings-details/:bookingId', component: MyBookingsDetailsComponent },
  { path: 'help', component: HelpPageComponent },
  { path: '**', redirectTo: '' } 
];
