import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LastMinuteFlightComponent } from '../../flights/pages/last-minute-flight/last-minute-flight.component';
import { FindAFlightComponent } from '../../flights/pages/find-a-flight/find-a-flight.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, LastMinuteFlightComponent, FindAFlightComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {}
