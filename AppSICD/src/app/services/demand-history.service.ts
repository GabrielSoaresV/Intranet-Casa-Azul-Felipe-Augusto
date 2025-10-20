import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DemandHistory } from '../models/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DemandHistoryService {
  private baseUrl = 'http://localhost:8080/api/history';

  constructor(private http: HttpClient) {}

  getHistoryByDemand(demandId: string): Observable<DemandHistory[]> {
    return this.http.get<DemandHistory[]>(`${this.baseUrl}/demand/${demandId}`);
  }

  createHistory(history: Partial<DemandHistory>): Observable<DemandHistory> {
    return this.http.post<{ data: DemandHistory }>(this.baseUrl, history)
      .pipe(map(res => res.data));
  }
}
