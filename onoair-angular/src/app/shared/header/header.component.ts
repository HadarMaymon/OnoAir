import { Component } from '@angular/core';
import { MatMenuModule} from '@angular/material/menu';
import { MatMenu} from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatIcon

 } from '@angular/material/icon';
@Component({
  selector: 'app-header',
  imports: [MatMenuModule,MatMenu,CommonModule,MatIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
