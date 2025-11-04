import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Demand } from '../../models/demand.model';

@Injectable({
  providedIn: 'root'
})
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

  updateDemandStatus(id: string, status: string): Observable<Demand> {
    return this.http.put<Demand>(`${this.apiUrl}/${id}/status?status=${status}`, {});
  }

  assignDemand(id: string, userId: string): Observable<Demand> {
    return this.http.put<Demand>(`${this.apiUrl}/${id}/assign`, { userId });
  }

  searchDemands(filters: any) {
  const params = new URLSearchParams();

  if (filters.term) params.append('term', filters.term);
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);

  return this.http.get<Demand[]>(`${this.apiUrl}/search?${params.toString()}`);
}

}
