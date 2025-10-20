import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Demand } from '../../shared/models/demand.model';

@Injectable({
  providedIn: 'root'
})
export class DemandService {
  private apiUrl = '/api/demands';

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
}
