import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Email {
  to: string;
  subject: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = `${environment.apiUrl}/api/email`;

  constructor(private http: HttpClient) {}

  enviarEmail(matricula: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${matricula}`, {});
  }
}
