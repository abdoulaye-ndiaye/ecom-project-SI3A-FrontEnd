import { ProductsService } from '../../shared/services/products.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CartService } from '../../shared/services/cart.service';


@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {
  //http://localhost:8000/products/download/677b9bef9689b74ebac46a25
  products: any[] = [];

  ngOnInit(): void {
    this.getAllProducts();
  }
  constructor(private ProductsService: ProductsService, private cartService: CartService) {;
   }
  // 1. Récupérer tous les produits
  getAllProducts(): void {
    this.ProductsService.getAllProducts().subscribe(
      (response: any) => {
        if (response && Array.isArray(response)) {
          this.products = response.map((product: any) => {
            return {
              ...product,
              imageUrl: `http://localhost:8000/products/download/${product._id}`,
            };
          });
          console.log(this.products);
        } else {
          console.error('Invalid response format:', response);
        }
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  // envoyer l'id du produit à la page de détail
  productDetail(id: string): void {
    console.log('Product ID:', id);
    localStorage.setItem('productId', id);
  }
  
  
// Fonction pour ajouter un produit au panier
addToCart(product: any): void {
  if (product.quantiteDispo <= 0) {
    Swal.fire({
      icon: 'error',
      title: 'Indisponible',
      text: 'Ce produit est en rupture de stock.',
    });
    return;
  }

  this.cartService.addToCart(product, 1); // Ajouter au panier avec une quantité de 1
  Swal.fire({
    icon: 'success',
    title: 'Produit ajouté au panier!',
    showConfirmButton: false,
    timer: 1200,
  });
}
}