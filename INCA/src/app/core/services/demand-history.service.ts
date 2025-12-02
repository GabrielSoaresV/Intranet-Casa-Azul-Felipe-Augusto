import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandHistory } from '../../models/demand-history.model';

@Injectable({
  providedIn: 'root'
})
export class DemandHistoryService {
  private apiUrl = 'http://localhost:8080/api/history';

  constructor(private http: HttpClient) {}

  getHistoryByDemand(demandId: string): Observable<DemandHistory[]> {
    return this.http.get<DemandHistory[]>(`${this.apiUrl}/demand/${demandId}`);
  }
}
