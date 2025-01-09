import { CommonModule } from '@angular/common';
import { Component, Input, OnInit} from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isHomePage: boolean = false;
  itemsCount: any = 0;


  constructor(private router: Router, private activatedRoute: ActivatedRoute,private cartService: CartService) {
  }

  ngOnInit(): void {
    this.cartService
      .getItemsCount()
      .subscribe((count) => {
        this.itemsCount = count;
      });
    this.cartService.refreshItemsCount();
    // Détecter les changements de route
    this.router.events.subscribe(() => {
      // Vérifier si la route actuelle est "home"
      this.isHomePage = this.router.url === '/dashboard';
    });
  }
}