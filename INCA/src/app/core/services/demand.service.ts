import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Demand } from '../../models/demand.model';

@Injectable({ providedIn: 'root' })
export class DemandService {
  private apiUrl = 'http://api-demanda:8082/api/demands';

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

  updateDemandStatus(id: string, status: string, notes?: string): Observable<Demand> {
    let params = new HttpParams().set('status', status);
    if (notes) params = params.set('notes', notes);
    return this.http.patch<Demand>(`${this.apiUrl}/${id}/status`, {}, { params });
  }

  assignDemand(demandId: string): Observable<Demand> {
    return this.http.put<Demand>(`${this.apiUrl}/${demandId}/assign`, { userId: '' });
  }

  searchDemands(filters: any): Observable<Demand[]> {
    const params = new URLSearchParams();
    if (filters.term) params.append('term', filters.term);
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    return this.http.get<Demand[]>(`${this.apiUrl}/search?${params.toString()}`);
  }

  deleteDemand(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
