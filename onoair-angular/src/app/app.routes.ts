import { Routes } from '@angular/router';
import { LastMinuteFlightComponent } from './features/flights/last-minute-flight/last-minute-flight.component';
import { FindAFlightComponent } from './features/flights/find-a-flight/find-a-flight.component';
import { HomepageComponent } from './shared/homepage/homepage.component';
import { ManageFlightComponent} from './features/flights/manage-flight/manage-flight.component';
import { EditFlightComponent } from './features/flights/edit-flight/edit-flight.component';

export const routes: Routes = [
  { path: 'homepage', component: HomepageComponent },
  { path: '', redirectTo: 'last-minute-flight', pathMatch: 'full' },
  { path: 'last-minute-flight', component: LastMinuteFlightComponent },
  { path: 'find-a-flight', component: FindAFlightComponent },
  { path: 'manage-flight', component: ManageFlightComponent },  
  { path: 'edit-flight/:flightNumber', component: EditFlightComponent },
  { path: '**', redirectTo: 'last-minute-flight' }
];