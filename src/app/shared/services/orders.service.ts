import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiUrl = `${environment.apiUrl}/orders/orders`;

  constructor(private http: HttpClient) {}

  // 1. Créer une commande
  createOrder(order: any): Observable<any> {
    return this.http.post(this.apiUrl, order);
  }

  // 2. Récupérer toutes les commandes
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 3. Récupérer une commande par ID
  getOrderById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // 4. Mettre à jour une commande
  updateOrder(id: string, order: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, order);
  }

  // 5. Supprimer une commande
  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
