// SupabaseService.mock.ts
import { Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {
    const fakeAdminUser = {
      id: 'admin-local',
      email: 'admin',
      role: 'admin'
    } as unknown as User;

    this.currentUserSubject.next(fakeAdminUser);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get client() {
    console.log('SupabaseService.client chamado');
    return null;
  }

  async signUp(email: string, password: string, name: string) {
    console.log('SupabaseService.signUp chamado', email, name);
    return {
      data: { user: this.getCurrentUser() },
      error: null
    };
  }

  async signIn(email: string, password: string) {
    console.log('SupabaseService.signIn chamado', email);
    return {
      data: { user: this.getCurrentUser() },
      error: null
    };
  }

  async signOut() {
    console.log('SupabaseService.signOut chamado');
    return { error: null };
  }
}
