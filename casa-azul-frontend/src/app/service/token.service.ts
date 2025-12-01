import { Injectable } from '@angular/core';

const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  setAccessToken(token: string) {
    if (!this.isBrowser()) return;
    localStorage.setItem(ACCESS_KEY, token);
  }

  getAccessToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(ACCESS_KEY);
  }

  setRefreshToken(token: string | null) {
    if (!this.isBrowser()) return;

    if (token) localStorage.setItem(REFRESH_KEY, token);
    else localStorage.removeItem(REFRESH_KEY);
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(REFRESH_KEY);
  }

  clear() {
    if (!this.isBrowser()) return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
}
