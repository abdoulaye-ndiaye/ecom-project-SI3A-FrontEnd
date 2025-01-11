import { UsersService } from './../../shared/services/users.service';
import { OrdersService } from './../../shared/services/orders.service';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

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

  constructor(private cartService: CartService, private fb: FormBuilder, private OrdersService: OrdersService, private UsersService: UsersService, private router: Router) {
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

  async placeOrder(): Promise<void> {
    if (this.billingForm.invalid) {
      console.error('Please fill out the form correctly before placing an order.');
      return;
    }

    try {
      // 1. Créer un utilisateur
      const userDetails = {
        prenom: this.billingForm.value.firstName,
        nom: this.billingForm.value.lastName,
        email: this.billingForm.value.email,
        numTel: this.billingForm.value.mobile,
        adresse: this.billingForm.value.address1,
        password: this.billingForm.value.password,
        role: 'USER',
      };
      const createUserResponse = await this.UsersService.createUser(userDetails).toPromise();
      console.log('User successfully created:', createUserResponse);

      Swal.fire({
        icon: 'success',
        title: 'Compte créé avec succès',
        showConfirmButton: false,
        timer: 1200,
      });

      // 2. Connecter l'utilisateur
      const credentials = {
        email: this.billingForm.value.email,
        password: this.billingForm.value.password,
      };
      
      const loginResponse = await this.UsersService.login(credentials).toPromise();
      console.log('User successfully logged in:', loginResponse);
      // suppression du token dans le local storage
      localStorage.removeItem('token');
      // Stocker le token
      localStorage.setItem('token', loginResponse.token);

      // 3. Décoder le token pour récupérer l'ID de l'utilisateur
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode<{ user: { _id: string } }>(token);
        this.userId = decodedToken.user._id;
        console.log('User ID:', this.userId);
      } else {
        console.error('No token found in localStorage');
        return;
      }

      // 4. Préparer les détails de la commande
      const orderDetails = {
        user: this.userId,
        status: 'PENDING',
        products: this.cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        address: this.billingForm.value.address1 || this.billingForm.value.address2,
        paymentMethod: this.paymentMethod,
      };

      // 5. Créer la commande
      const createOrderResponse = await this.OrdersService.createOrder(orderDetails).toPromise();
      console.log('Order successfully created:', createOrderResponse);

      Swal.fire({
        icon: 'success',
        title: 'Commande créée avec succès. Merci de bien verifier votre email!',
        showConfirmButton: false,
        timer: 2200,
      }).then(() => {
        this.router.navigate(['/dashboard']);
      });

      // 6. Vider le panier
      this.cartService.clearCart();
     

    } catch (error) {
      console.error('Error during order process:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur s\'est produite lors du traitement de votre commande.',
      });
    }
  }
}

