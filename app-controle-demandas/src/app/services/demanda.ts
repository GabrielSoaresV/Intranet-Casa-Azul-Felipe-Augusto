import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandaModel } from '../models/demanda.model';

@Injectable({
  providedIn: 'root'
})
export class DemandaService {
  private apiUrl = 'http://localhost:8080/demandas';

  constructor(private http: HttpClient) {}

  listarPorCidadao(cpf: string): Observable<DemandaModel[]> {
    return this.http.get<DemandaModel[]>(`${this.apiUrl}/cidadao/${cpf}`);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}