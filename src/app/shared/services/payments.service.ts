import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  private apiUrl = `${environment.apiUrl}/paytech/paytech`;

  constructor(private http: HttpClient) {}

  // 1. Effectuer un paiement
  processPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/payer`, paymentData);
  }

  // 2. Tester l'envoi d'e-mails
  sendTestEmail(emailData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/email-test`, emailData);
  }

  // 3. Notification IPN (optionnel, si nécessaire côté frontend)
  handleNotification(notificationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/notification_ipn`, notificationData);
  }
}
