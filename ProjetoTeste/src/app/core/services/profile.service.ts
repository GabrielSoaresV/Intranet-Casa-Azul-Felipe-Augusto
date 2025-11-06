import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { Profile } from '../../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'http://localhost:8080/api/profiles';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  /** 🔹 Login - retorna JWT e role */
  login(login: string, password: string): Observable<{ token: string; role: string }> {
    return this.http.post<any>(`${this.baseUrl}/login`, { login, password }).pipe(
      map(res => {
        if (res.data?.token) {
          localStorage.setItem(this.tokenKey, res.data.token);
        }
        return res.data;
      })
    );
  }

  /** 🔹 Obter JWT armazenado */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /** 🔹 Logout */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  /** 🔹 Obter perfil do usuário logado */
  getCurrentProfile(): Observable<Profile> {
    return this.http.get<any>(`${this.baseUrl}/me`).pipe(map(res => res.data));
  }

  /** 🔹 Atualizar perfil do usuário logado */
  updateCurrentProfile(updates: Partial<Profile>): Observable<Profile> {
    return this.http.put<any>(`${this.baseUrl}/me`, updates).pipe(map(res => res.data));
  }

  /** 🔹 Criar novo perfil (ADMIN) */
  create(profile: Profile): Observable<Profile> {
    return this.http.post<any>(this.baseUrl, profile).pipe(map(res => res.data));
  }

  /** 🔹 Listar todos os perfis (ADMIN) */
  getAll(): Observable<Profile[]> {
    return this.http.get<any>(this.baseUrl).pipe(map(res => res.data));
  }

  /** 🔹 Buscar perfil por CPF (ADMIN) */
  getByCpf(cpf: string): Observable<Profile> {
    return this.http.get<any>(`${this.baseUrl}/${cpf}`).pipe(map(res => res.data));
  }

  /** 🔹 Deletar perfil por CPF (ADMIN) */
  delete(cpf: string): Observable<void> {
    return this.http.delete<any>(`${this.baseUrl}/${cpf}`).pipe(map(() => undefined));
  }

  /** 🔹 Upload do avatar (salva no banco de dados) */
  uploadAvatar(file: File): Observable<Profile> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.baseUrl}/me/avatar`, formData).pipe(map(res => res.data));
  }

  getAvatar(): Observable<string> {
    const url = `${this.baseUrl}/me/avatar`;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map(blob => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob); // converte em base64
        });
      }),
      // converte Promise<string> -> Observable<string>
      switchMap(promise => promise)
    );
  }
}
