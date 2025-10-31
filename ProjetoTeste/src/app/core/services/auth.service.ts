import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Profile } from '../../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<Profile | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    console.log('🚀 AuthService inicializado.');
    console.log('📦 Token atual no localStorage:', localStorage.getItem('token'));
    console.log('👤 Usuário atual no localStorage:', localStorage.getItem('currentUser'));
  }

  private hasToken(): boolean {
    const has = !!localStorage.getItem('token');
    console.log(`🔍 Verificando token existente: ${has ? 'ENCONTRADO ✅' : 'NÃO ENCONTRADO ❌'}`);
    return has;
  }

  private getUserFromStorage(): Profile | null {
    const userStr = localStorage.getItem('currentUser');
    console.log('📦 Recuperando usuário do localStorage:', userStr);
    return userStr ? JSON.parse(userStr) : null;
  }

  setToken(token: string): void {
    console.log('💾 Salvando token recebido:', token);
    if (!token) {
      console.warn('⚠️ Token vazio ou indefinido!');
    }
    localStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('📤 Token obtido do localStorage:', token);
    return token;
  }

  setCurrentUser(user: Profile): void {
    console.log('💾 Salvando usuário atual:', user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): Profile | null {
    const user = this.currentUserSubject.value;
    console.log('👤 Usuário atual em memória:', user);
    return user;
  }

  logout(): void {
    console.log('🚪 Logout executado. Removendo token e usuário.');
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    const isAdmin = user?.role === 'ADMIN';
    console.log(`👑 isAdmin(): ${isAdmin}`);
    return isAdmin;
  }

  isAttendant(): boolean {
    const user = this.getCurrentUser();
    const isAttendant = user?.role === 'ATTENDANT';
    console.log(`🎧 isAttendant(): ${isAttendant}`);
    return isAttendant;
  }
}
