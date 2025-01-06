import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/component/header/header.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
