import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/component/header/header.component";

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {

}
