import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}/products/products`;

  constructor(private http: HttpClient) {}

  // 1. Créer un produit avec un fichier
  createProduct(productData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, productData);
  }

  // 2. Récupérer tous les produits
  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 3. Récupérer un produit par ID
  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // 4. Mettre à jour un produit avec un fichier
  updateProduct(id: string, productData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, productData);
  }

  // 5. Supprimer un produit
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 6. Télécharger l'image d'un produit
  downloadProductImage(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${id}`, { responseType: 'blob' });
  }
}
