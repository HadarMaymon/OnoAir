import { Component } from '@angular/core';
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import { HeaderComponent } from "./shared/header/header.component";
import { FooterComponent } from './shared/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { FirebaseApp } from '@angular/fire/app';

@Component({
  selector: 'app-root',
  imports: [MatMenuModule, MatButtonModule, HeaderComponent,
    RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'onoair-angular';
}
