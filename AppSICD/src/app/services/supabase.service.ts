import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {
    this.supabase = createClient(
      'https://unspbabuezjxhvrmmmhz.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuc3BiYWJ1ZXpqeGh2cm1tbWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MzYwMzIsImV4cCI6MjA3NjAxMjAzMn0.9BwCgStcxq3jhrjB0yXzbNk_pY4g39Omk3y5cO0kknI'
    );

    this.supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        this.currentUserSubject.next(session?.user ?? null);
      })();
    });

    this.loadUser();
  }

  private async loadUser() {
    const { data } = await this.supabase.auth.getSession();
    this.currentUserSubject.next(data.session?.user ?? null);
  }

  get client() {
    return this.supabase;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  async signUp(email: string, password: string, name: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (data.user && !error) {
      await this.supabase.from('profiles').insert({
        id: data.user.id,
        name,
        email,
        role: 'attendant'
      });
    }

    return { data, error };
  }

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }
}
