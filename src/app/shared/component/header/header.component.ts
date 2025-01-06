import { CommonModule } from '@angular/common';
import { Component, Input, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isHomePage: boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    // Détecter les changements de route
    this.router.events.subscribe(() => {
      // Vérifier si la route actuelle est "home"
      this.isHomePage = this.router.url === '/dashboard';
    });
  }
}