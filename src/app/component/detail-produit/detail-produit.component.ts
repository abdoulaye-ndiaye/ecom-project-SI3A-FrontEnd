import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { ProductsService } from "../../shared/services/products.service";
import { CartService } from "../../shared/services/cart.service";
import Swal from "sweetalert2";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-detail-produit",
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: "./detail-produit.component.html",
    styleUrls: ["./detail-produit.component.css"], // Correction de `styleUrl` en `styleUrls`
})
export class DetailProduitComponent implements OnInit, OnDestroy {
    productId: string | null = null;
    product: any = {}; // Produit à afficher
    quantity: number = 1; // Quantité par défaut

    @Input() min: number = 1; // Quantité minimale
    @Input() max: number = 100; // Quantité maximale

    private refreshSizeTimeout: any; // Pour nettoyer le timeout

    constructor(
        private productService: ProductsService,
        private cartService: CartService
    ) {}

    ngOnInit(): void {
        // Récupérer l'ID du produit depuis localStorage
        this.productId = localStorage.getItem("productId");
        console.log("Product ID from localStorage:", this.productId);

        if (this.productId) {
            this.loadProductDetails(this.productId);
        }
    }

    ngOnDestroy(): void {
        // Nettoyer le timeout si utilisé
        if (this.refreshSizeTimeout) {
            clearTimeout(this.refreshSizeTimeout);
        }
    }

    // Charger les détails du produit
    loadProductDetails(productId: string): void {
        this.productService.getProductById(productId).subscribe(
            (response: any) => {
                console.log("Product details response:", response);
                if (response) {
                    this.product = {
                        ...response,
                        imageUrl: `http://gateway-api:8000/products/download/${response._id}`, // Construire l'URL de l'image
                    };
                } else {
                    console.error("Invalid response:", response);
                }
            },
            (error) => {
                console.error("Error fetching product details:", error);
            }
        );
    }

    // Incrémenter la quantité
    incrementQuantity(): void {
        if (this.quantity < this.max) {
            this.quantity++;
        }
    }

    // Décrémenter la quantité
    decrementQuantity(): void {
        if (this.quantity > this.min) {
            this.quantity--;
        }
    }

    // Ajouter au panier
    addToCart(): void {
        if (this.quantity > this.product.quantiteDispo) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Seulement ${this.product.quantiteDispo} unités disponibles en stock.`,
            });
        } else {
            this.cartService.addToCart(this.product, this.quantity);
            this.alert();
            this.quantity = 1; // Réinitialiser la quantité après ajout
        }
    }

    // Alerte de succès
    alert(): void {
        Swal.fire({
            icon: "success",
            title: "Produit ajouté au panier!",
            showConfirmButton: false,
            timer: 1200,
        });
    }
}
