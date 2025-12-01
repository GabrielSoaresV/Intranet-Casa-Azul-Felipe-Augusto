import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AuthRequest } from '../models/auth-request.model';
import { AuthResponse } from '../models/auth-response.model';
import { TokenService } from './token.service';
import { RegisterRequest } from '../models/register-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = environment.authApiUrl;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(payload: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/auth/login`, payload).pipe(
      tap(res => {
        this.tokenService.setAccessToken(res.accessToken);
        this.tokenService.setRefreshToken(res.refreshToken);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    // Controller espera /auth/refresh?refreshToken=...
    const params = new HttpParams().set('refreshToken', refreshToken);
    return this.http.post<AuthResponse>(`${this.authUrl}/auth/refresh`, null, { params }).pipe(
      tap(res => {
        this.tokenService.setAccessToken(res.accessToken);
        this.tokenService.setRefreshToken(res.refreshToken);
      })
    );
  }

  logout(): Observable<string> {
    // server invalidates refresh tokens for the user
    return this.http.post(`${this.authUrl}/auth/logout`, null, { responseType: 'text' }).pipe(
      tap(() => this.tokenService.clear()),
      map(res => String(res))
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/users/register`, payload).pipe(
      tap(res => {
        this.tokenService.setAccessToken(res.accessToken);
        this.tokenService.setRefreshToken(res.refreshToken);
      })
    );
  }

  isLoggedIn() {
    if (typeof window === 'undefined') return false;
    return this.tokenService.getAccessToken() != null;
  }
}
