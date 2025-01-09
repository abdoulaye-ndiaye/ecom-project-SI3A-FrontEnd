import { RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = []; // Liste des articles dans le panier
  subtotal: number = 0; // Sous-total
  shipping: number = 10; // Coût fixe d'expédition
  total: number = 0; // Total général

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.calculateTotals();
  }

  // Charger les articles du panier
  loadCartItems(): void {
    this.cartItems = this.cartService.getItems();
  }

  // Mettre à jour le panier et recalculer les totaux
  updateCart(): void {
    this.cartService.saveCartItems();
    this.calculateTotals();
    this.cartService.refreshItemsCount();
  }

  // Calculer les totaux
  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce(
      (acc, item) => acc + item.product.prix * item.quantity,
      0
    );
    this.total = this.subtotal + this.shipping;
  }

  // Incrémenter la quantité
  incrementQuantity(item: any): void {
    if (item.quantity < item.product.quantite) {
      item.quantity++;
      this.updateCart();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Stock insuffisant',
        text: `Seulement ${item.product.quantite} unités disponibles.`,
      });
    }
  }

  // Décrémenter la quantité
  decrementQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCart();
    }
  }

  // Supprimer un article
  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
    this.loadCartItems();
    this.calculateTotals();
    Swal.fire({
      icon: 'success',
      title: 'Produit retiré du panier',
      showConfirmButton: false,
      timer: 1200,
    });
  }

  // Appliquer un coupon (placeholder)
  applyCoupon(): void {
    Swal.fire({
      icon: 'info',
      title: 'Fonctionnalité à implémenter',
      text: 'Les coupons seront disponibles bientôt.',
    });
  }
}
