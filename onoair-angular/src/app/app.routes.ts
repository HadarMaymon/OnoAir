import { Routes } from '@angular/router';
import { LastMinuteFlightComponent } from './components/flights/last-minute-flight/last-minute-flight.component';
import { FindAFlightComponent } from './components/flights/find-a-flight/find-a-flight.component';

export const routes: Routes = [
  { path: 'find-a-flight', component: FindAFlightComponent }, 
  { path: '', redirectTo: 'find-a-flight', pathMatch: 'full' }, 
];
