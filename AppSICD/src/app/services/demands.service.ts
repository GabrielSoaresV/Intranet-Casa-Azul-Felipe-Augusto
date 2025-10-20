import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Demand } from '../models/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DemandsService {
  private baseUrl = 'http://localhost:8080/api/demands';

  constructor(private http: HttpClient) {}

  getAllDemands(): Observable<Demand[]> {
    return this.http.get<Demand[]>(this.baseUrl);
  }

  getDemandById(id: string): Observable<Demand> {
    return this.http.get<Demand>(`${this.baseUrl}/${id}`);
  }

  getDemandsByCreator(cpf: string): Observable<Demand[]> {
    return this.http.get<Demand[]>(`${this.baseUrl}/creator/${cpf}`);
  }

  createDemand(demand: Partial<Demand>): Observable<Demand> {
    return this.http.post<{ message: string; data: Demand }>(this.baseUrl, demand)
      .pipe(map(res => res.data));
  }

  updateDemandStatus(id: string, status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'): Observable<Demand> {
    const params = new HttpParams().set('status', status);
    return this.http.put<Demand>(`${this.baseUrl}/${id}/status`, null, { params });
  }

  assignDemand(id: string, userCpf: string): Observable<Demand> {
    return this.http.put<Demand>(`${this.baseUrl}/${id}/assign`, { userId: userCpf });
  }
}
