import { Component, OnInit } from '@angular/core';  
import { CartService } from '../../shared/services/cart.service';  
import { CommonModule } from '@angular/common';  
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';  

@Component({  
  selector: 'app-checkout',  
  standalone: true,  
  imports: [CommonModule, ReactiveFormsModule, FormsModule],  
  templateUrl: './checkout.component.html',  
  styleUrls: ['./checkout.component.css']  
})  
export class CheckoutComponent implements OnInit {  
  billingForm: FormGroup;  
  shippingForm: FormGroup;  
  useShippingAddress: boolean = false;  
  cartItems: any[] = [];  
  subtotal: number = 0;  
  shipping: number = 10; // Fixed shipping cost  
  paymentMethod: string = '';  

  constructor(private cartService: CartService, private fb: FormBuilder) {  
    // Initialize billing and shipping forms with validation  
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
    });  

    // Initialize shipping form using the same structure as billing  
    this.shippingForm = this.fb.group({  
      firstName: ['', [Validators.required]],  
      lastName: ['', [Validators.required]],  
      email: ['', [Validators.required, Validators.email]],  
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],  
      address1: ['', [Validators.required]],  
      address2: [''],  
      country: ['', [Validators.required]],  
      city: ['', [Validators.required, Validators.minLength(2)]],  
      state: ['', [Validators.required, Validators.minLength(2)]],  
      zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],  
    });  
  }  

  ngOnInit(): void {  
    this.cartItems = this.cartService.getItems(); // Load items from cart  
    this.calculateSubtotal();  
  }  

  toggleShippingAddress(): void {  
    if (!this.useShippingAddress) {  
      // Copy billing address to shipping address  
      this.shippingForm.patchValue(this.billingForm.value);  
    } else {  
      // Reset shipping address fields if checkbox is unchecked  
      this.shippingForm.reset();  
    }  
  }  

  calculateSubtotal(): void {  
    this.subtotal = this.cartItems.reduce(  
      (total, item) => total + (item.product.prix * item.quantity),  
      0  
    );  
  }  

  placeOrder(): void {  
    if (this.billingForm.invalid || (this.useShippingAddress && this.shippingForm.invalid)) {  
      console.error('Please fill out the forms correctly before placing an order.');  
      return; // Exit if forms are invalid  
    }  

    const orderDetails = {  
      billingAddress: this.billingForm.value,  
      shippingAddress: this.useShippingAddress ? this.shippingForm.value : this.billingForm.value,  
      cartItems: this.cartItems,  
      subtotal: this.subtotal,  
      shipping: this.shipping,  
      total: this.subtotal + this.shipping,  
      paymentMethod: this.paymentMethod,  
    };  

    console.log('Order Placed:', orderDetails);  
    // Add logic for API POST request to submit the order  
  }  
}