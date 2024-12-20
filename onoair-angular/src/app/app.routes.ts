import { Routes } from '@angular/router';
import { LastMinuteFlightComponent } from './features/flights/last-minute-flight/last-minute-flight.component';
import { FindAFlightComponent } from './features/flights/find-a-flight/find-a-flight.component';
import { HomepageComponent } from './shared/homepage/homepage.component';

export const routes: Routes = [
  { path: 'homepage', component: HomepageComponent }, 
  { path: 'last-minute-flight', component: LastMinuteFlightComponent }, 
  { path: 'find-a-flight', component: FindAFlightComponent }, 
  { path: '', redirectTo: 'last-minute-flight', pathMatch: 'full' }, 
];
