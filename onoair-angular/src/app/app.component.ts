import { Component } from '@angular/core';
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import { HomepageComponent } from './shared/homepage/homepage.component';
import { HeaderComponent } from "./shared/header/header.component";
import { LastMinuteFlightComponent } from "./components/flights/last-minute-flight/last-minute-flight.component";
import { FindAFlightComponent } from "./components/flights/find-a-flight/find-a-flight.component";

@Component({
  selector: 'app-root',
  imports: [MatMenuModule, MatButtonModule, HomepageComponent, HeaderComponent, LastMinuteFlightComponent, FindAFlightComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'onoair-angular';
}
