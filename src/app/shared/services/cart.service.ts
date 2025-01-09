import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: { product: Product; quantity: number }[] = []; // Liste des produits avec quantités
  private itemsCount = new Subject<number>(); // Compteur d'articles total

  constructor() {
    this.initializeCartItems();
    this.refreshItemsCount();
  }

  // Initialiser les articles depuis localStorage
  initializeCartItems(): void {
    const cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
      this.items = JSON.parse(cartItems);
      this.itemsCount.next(this.calculateAllQuantity());
    }
  }

  // Sauvegarder les articles dans localStorage
  saveCartItems(): void {
    localStorage.setItem('cartItems', JSON.stringify(this.items));
  }

  // Ajouter un produit au panier
  addToCart(product: Product, quantity: number): void {
    const existingItem = this.items.find((item) => item.product._id === product._id);

    if (existingItem) {
      // Mettre à jour la quantité si le produit existe déjà
      existingItem.quantity += quantity;
    } else {
      // Ajouter un nouveau produit
      this.items.push({ product, quantity });
    }

    this.saveCartItems();
    this.refreshItemsCount();
  }

  // Récupérer tous les articles du panier
  getItems(): { product: Product; quantity: number }[] {
    return this.items;
  }

  // Récupérer un produit spécifique dans le panier
  getItemById(productId: string): { product: Product; quantity: number } | undefined {
    return this.items.find((item) => item.product._id === productId);
  }

  // Supprimer un produit du panier
  removeFromCart(productId: string): void {
    this.items = this.items.filter((item) => item.product._id !== productId);
    this.saveCartItems();
    this.refreshItemsCount();
  }

  // Vider le panier
  clearCart(): void {
    this.items = [];
    this.saveCartItems();
    this.refreshItemsCount();
  }

  // Calculer la quantité totale d'articles dans le panier
  calculateAllQuantity(): number {
    return this.items.reduce((acc, item) => acc + item.quantity, 0);
  }

  // Obtenir le nombre total d'articles
  getItemsCount() {
    return this.itemsCount.asObservable();
  }

  // Mettre à jour le compteur d'articles
  refreshItemsCount(): void {
    this.itemsCount.next(this.calculateAllQuantity());
  }
}
