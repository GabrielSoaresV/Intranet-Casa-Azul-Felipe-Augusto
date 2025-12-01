import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserResponse } from '../models/user-response.model';
import { UserDetailsResponse } from '../models/user-details-response.model';
import { UpdateUserRequest } from '../models/update-user-request.model';
import { ChangePasswordRequest } from '../models/change-password-request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // These endpoints live in the auth service (8081)
  private base = environment.authApiUrl + '/users';

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.base}/me`);
  }

  getAllUsers(): Observable<UserDetailsResponse[]> {
    return this.http.get<UserDetailsResponse[]>(this.base);
  }

  getUserDetails(username: string) {
    return this.http.get<UserDetailsResponse>(`${this.base}/${encodeURIComponent(username)}`);
  }

  updateUser(payload: UpdateUserRequest) {
    return this.http.put<string>(`${this.base}/update`, payload);
  }

  changePassword(payload: ChangePasswordRequest) {
    return this.http.post<string>(`${this.base}/change-password`, payload);
  }

  uploadProfile(userId: number, file: File) {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post(`${this.base}/${userId}/upload-profile`, fd);
  }

  deleteProfile(userId: number) {
    return this.http.delete(`${this.base}/${userId}/delete-profile`);
  }

  setEnabled(userId: number, enabled: boolean) {
    return this.http.patch(`${this.base}/${userId}/enabled`, { enabled });
  }

  disableUser(userId: number) {
    return this.http.post(`${this.base}/${userId}/disable`, null);
  }

  enableUser(userId: number) {
    return this.http.post(`${this.base}/${userId}/enable`, null);
  }
}
