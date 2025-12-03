import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = `${environment.apiGestao}/api/email`;

  constructor(private http: HttpClient) {}

  enviarEmail(matricula: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${matricula}`, {});
  }
}
