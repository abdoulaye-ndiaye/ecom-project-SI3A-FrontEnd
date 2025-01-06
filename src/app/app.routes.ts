import { Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { DetailProduitComponent } from './component/detail-produit/detail-produit.component';
import { ShopComponent } from './component/shop/shop.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { ShoppingCartComponent } from './component/shopping-cart/shopping-cart.component';
import { ContactComponent } from './component/contact/contact.component';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
    },
    {
        path: "dashboard",
        component: DashboardComponent,
    },
    {
        path: "detail-produit",
        component: DetailProduitComponent,
    },
    {
        path: "shop",
        component: ShopComponent,
    },
    {
        path: "checkout",
        component: CheckoutComponent,
    },
    {
        path: 'shopping-cart',
        component: ShoppingCartComponent,
    },
    {
        path: "contact",
        component: ContactComponent,
    }
];
