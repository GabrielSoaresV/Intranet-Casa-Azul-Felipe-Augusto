import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private api = 'http://192.168.1.22:8082/api/email';

  constructor(private http: HttpClient) {}

  enviarEmail(matricula: string): Observable<void> {
    return this.http.post<void>(`${this.api}/${matricula}`, {});
  }
}
