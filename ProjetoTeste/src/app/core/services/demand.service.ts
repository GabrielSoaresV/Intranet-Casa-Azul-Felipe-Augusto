// src/app/core/services/demand.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Demand } from '../../models/demand.model';

@Injectable({ providedIn: 'root' })
export class DemandService {
  private apiUrl = 'http://localhost:8080/api/demands';

  constructor(private http: HttpClient) {}

  getAllDemands(): Observable<Demand[]> {
    return this.http.get<Demand[]>(this.apiUrl);
  }

  getDemandById(id: string): Observable<Demand> {
    return this.http.get<Demand>(`${this.apiUrl}/${id}`);
  }

  getDemandsByCreator(cpf: string): Observable<Demand[]> {
    return this.http.get<Demand[]>(`${this.apiUrl}/creator/${cpf}`);
  }

  createDemand(demand: Demand): Observable<Demand> {
    return this.http.post<Demand>(this.apiUrl, demand);
  }

  /** ✅ PATCH /{id}/status?status=...&notes=... */
  updateDemandStatus(id: string, status: string, notes?: string): Observable<Demand> {
    let params = new HttpParams().set('status', status);
    if (notes) params = params.set('notes', notes);
    // body vazio, mas PATCH por causa do controller
    return this.http.patch<Demand>(`${this.apiUrl}/${id}/status`, {}, { params });
  }

  assignDemand(id: string, userId: string): Observable<Demand> {
    return this.http.put<Demand>(`${this.apiUrl}/${id}/assign`, { userId });
  }

  searchDemands(filters: any): Observable<Demand[]> {
    const params = new URLSearchParams();
    if (filters.term) params.append('term', filters.term);
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    return this.http.get<Demand[]>(`${this.apiUrl}/search?${params.toString()}`);
  }
}
