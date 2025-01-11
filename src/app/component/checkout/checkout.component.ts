import { UsersService } from './../../shared/services/users.service';
import { OrdersService } from './../../shared/services/orders.service';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  billingForm: FormGroup;
  cartItems: any[] = [];
  subtotal: number = 0;
  shipping: number = 10; // Fixed shipping cost
  paymentMethod: string = '';
  userId: string = '';

  constructor(private cartService: CartService, private fb: FormBuilder, private OrdersService: OrdersService, private UsersService: UsersService) {
    // Initialize billing form with validation
    this.billingForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z]+$/)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address1: ['', [Validators.required]],
      address2: [''],
      country: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required, Validators.minLength(2)]],
      zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validators: this.passwordMatchValidator // Custom validator for password matching
    });
  }

  ngOnInit(): void {
    this.cartItems = this.cartService.getItems(); // Load items from cart
    this.calculateSubtotal();
  }

  calculateSubtotal(): void {
    this.subtotal = this.cartItems.reduce(
      (total, item) => total + (item.product.prix * item.quantity),
      0
    );
  }

 

  // Custom validator to ensure password and confirmPassword match
  passwordMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password && confirmPassword && password === confirmPassword
      ? null
      : { mismatch: true };
  }

  placeOrder(): void {
    if (this.billingForm.invalid) {
      console.error('Please fill out the form correctly before placing an order.');
      return; // Exit if the form is invalid
    }
    // creer un utilisateur
    const userDetails = {
      prenom: this.billingForm.value.firstName,
      nom: this.billingForm.value.lastName,
      email: this.billingForm.value.email,
      numTel: this.billingForm.value.mobile,
      adresse: this.billingForm.value.address1,
      password: this.billingForm.value.password,
      role:'USER',
    };
    this.UsersService.createUser(userDetails).subscribe(
      (response: any) => {
        console.log('User successfully created:', response);
        Swal.fire({
          icon: 'success',
          title: 'Compte cree avec succéss',
          showConfirmButton: false,
          timer: 1200,
        });
      },
      (error: any) => {
        console.error('Error creating user:', error);
      }
    );

    // connecter l'utilisateur
    const credentials = {
      email: this.billingForm.value.email,
      password: this.billingForm.value.password,
    };

    this.UsersService.login(credentials).subscribe(
      (response: any) => {
        console.log('User successfully logged in:', response);
        localStorage.setItem('token', response.token);
      },
      (error: any) => {
        console.error('Error logging in user:', error);
      }
    );

    // recuperer l'id de l'utilisateur sur le token
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode<{ user: { _id: string } }>(token);
      console.log('Decoded token:', decodedToken);
      this.userId = decodedToken.user._id;
      console.log('User ID:', this.userId);
    } else {
      console.error('No token found in localStorage');
    }

  
    // Préparer les détails de la commande
    const orderDetails = {
      user: this.userId, // Remplacez par l'ID de l'utilisateur authentifié
      status: 'pending', // Statut initial de la commande
      products: this.cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      address: this.billingForm.value.address1 || this.billingForm.value.address2, // Adresse de facturation
      paymentMethod: this.paymentMethod, // Méthode de paiement sélectionnée
    };
  
    // Appel de l'API pour créer une commande
    this.OrdersService.createOrder(orderDetails).subscribe(
      (response: any) => {
        console.log('Order successfully created:', response);
        Swal.fire({
          icon: 'success',
          title: 'Commande cree avec succéss',
          showConfirmButton: false,
          timer: 1200,
        });
        // Vider le panier après la commande
        this.cartService.clearCart();
      },
      (error: any) => {
        console.error('Error creating order:', error);
      }
    );
  }
  
}

