import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router'; 
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [MatMenuModule, CommonModule, MatIcon, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  constructor(private router: Router) {}  

  navigateToHome(): void {
    this.router.navigate(['/last-minute-flight']);  
  }
}
