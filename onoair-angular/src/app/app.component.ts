import { Component } from '@angular/core';
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import { HomepageComponent } from './shared/homepage/homepage.component';
import { HeaderComponent } from "./shared/header/header.component";
import { LastMinuteFlightComponent } from "./features/flights/last-minute-flight/last-minute-flight.component";
import { FindAFlightComponent } from './features/flights/find-a-flight/find-a-flight.component';
import { RouterOutlet } from '@angular/router';
import { ManageFlightComponent } from './features/flights/manage-flight/manage-flight.component';

@Component({
  selector: 'app-root',
  imports: [MatMenuModule, MatButtonModule, HomepageComponent, HeaderComponent, LastMinuteFlightComponent, FindAFlightComponent, RouterOutlet, ManageFlightComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'onoair-angular';
}
