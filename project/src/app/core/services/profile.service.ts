import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../../shared/models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = '/api/profiles';

  constructor(private http: HttpClient) {}

  login(login: string, password: string): Observable<{ token: string; role: string }> {
    return this.http.post<{ token: string; role: string }>(`${this.apiUrl}/login`, { login, password });
  }

  getCurrentProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/me`);
  }

  updateCurrentProfile(updates: Partial<Profile>): Observable<Profile> {
    return this.http.put<Profile>(`${this.apiUrl}/me`, updates);
  }

  getAllProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(this.apiUrl);
  }

  getProfileByCpf(cpf: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/${cpf}`);
  }

  createProfile(profile: Profile): Observable<Profile> {
    return this.http.post<Profile>(this.apiUrl, profile);
  }

  deleteProfile(cpf: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cpf}`);
  }
}
