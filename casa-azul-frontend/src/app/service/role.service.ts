import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RoleResponse } from '../models/role-response.model';
import { RoleUpdateRequest } from '../models/role-update-request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private base = environment.authApiUrl + '/roles';

  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<RoleResponse[]> {
    return this.http.get<RoleResponse[]>(this.base);
  }

  getUserRoles(username: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/${encodeURIComponent(username)}`);
  }

  addRole(username: string, payload: RoleUpdateRequest) {
    return this.http.post(`${this.base}/${encodeURIComponent(username)}/add`, payload, { responseType: 'text' });
  }

  removeRole(username: string, payload: RoleUpdateRequest) {
    return this.http.post(`${this.base}/${encodeURIComponent(username)}/remove`, payload, { responseType: 'text' });
  }
}
