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

  private apiUrl = 'http://localhost:8080/api/emails';

  constructor(private http: HttpClient) {}

  sendEmail(email: Email): Observable<void> {
    return this.http.post<void>(this.apiUrl, email);
  }
}
