import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Email {
  to: string;
  subject: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = 'http://backend:8080/api/email';

  constructor(private http: HttpClient) {}

  enviarEmail(matricula: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${matricula}`, {});
  }
}
