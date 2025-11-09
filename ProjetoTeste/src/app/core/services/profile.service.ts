import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { Profile } from '../../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'http://localhost:8080/api/profiles';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  // ========================================================
  // 🔹 Autenticação
  // ========================================================

  /** Login - retorna JWT e role */
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

  /** Obter JWT armazenado */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /** Logout */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // ========================================================
  // 🔹 Perfil do usuário logado
  // ========================================================

  getCurrentProfile(): Observable<Profile> {
    return this.http.get<any>(`${this.baseUrl}/me`).pipe(map(res => res.data));
  }

  updateCurrentProfile(updates: Partial<Profile>): Observable<Profile> {
    return this.http.put<any>(`${this.baseUrl}/me`, updates).pipe(map(res => res.data));
  }

  // ========================================================
  // 🔹 Criação de usuários
  // ========================================================

  /**
   * Criar novo perfil (rota protegida para ADMIN)
   * O backend deve validar o token e permitir apenas ADMIN criar outros perfis.
   */
  create(profile: Profile): Observable<Profile> {
    return this.http.post<any>(this.baseUrl, profile).pipe(map(res => res.data));
  }

  /** 🔓 Criar perfil público (sem autenticação)
   * Sempre cria um usuário com role = "CITIZEN".
   * Ideal para rota /register (pública)
   */
  publicRegister(profile: Partial<Profile>): Observable<Profile> {
    // 🔒 Força o papel de cidadão
    const safeProfile = { ...profile, role: 'CITIZEN' as 'CITIZEN' };

    // 🧩 Use a rota correta do backend:
    // se seu backend espera /public ou /public-register, ajuste abaixo
    return this.http
      .post<any>(`${this.baseUrl}/public-register`, safeProfile)
      .pipe(map(res => res.data));
  }


  // ========================================================
  // 🔹 Consultas e ações administrativas
  // ========================================================

  getAll(): Observable<Profile[]> {
    return this.http.get<any>(this.baseUrl).pipe(map(res => res.data));
  }

  getByCpf(cpf: string): Observable<Profile> {
    return this.http.get<any>(`${this.baseUrl}/${cpf}`).pipe(map(res => res.data));
  }

  delete(cpf: string): Observable<void> {
    return this.http.delete<any>(`${this.baseUrl}/${cpf}`).pipe(map(() => undefined));
  }

  // ========================================================
  // 🔹 Avatares
  // ========================================================

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
          reader.readAsDataURL(blob);
        });
      }),
      switchMap(promise => promise)
    );
  }
}
