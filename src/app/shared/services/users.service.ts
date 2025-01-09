import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/users/users`;

  constructor(private http: HttpClient) {}

  // 1. Login utilisateur
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // 2. Créer un utilisateur
  createUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  // 3. Récupérer tous les utilisateurs
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 4. Récupérer un utilisateur par ID
  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // 5. Mettre à jour un utilisateur
  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  // 6. Supprimer un utilisateur
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 7. Bloquer un utilisateur
  blockUser(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/block/${id}`, {});
  }

  // 8. Débloquer un utilisateur
  unblockUser(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/unblock/${id}`, {});
  }
}

