import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandaCreateDTO } from '../dtos/dto-demandas/demanda-create.dto';
import { DemandaUpdateDTO } from '../dtos/dto-demandas/demanda-update.dto';
import { DemandaStatusDTO } from '../dtos/dto-demandas/demanda-status.dto';
import { DemandaSearchDTO } from '../dtos/dto-demandas/demanda-search.dto';

@Injectable({
  providedIn: 'root'
})
export class DemandaService {
  private baseUrl = 'http://localhost:8080/demandas';

  constructor(private http: HttpClient) {}

  listar(): Observable<DemandaSearchDTO[]> {
    return this.http.get<DemandaSearchDTO[]>(this.baseUrl);
  }

  listarPorCidadao(cpf: string): Observable<DemandaSearchDTO[]> {
    return this.http.get<DemandaSearchDTO[]>(`${this.baseUrl}/cidadao/${cpf}`);
  }

  criar(dto: DemandaCreateDTO): Observable<DemandaSearchDTO> {
    return this.http.post<DemandaSearchDTO>(this.baseUrl, dto);
  }

  atualizar(id: number, dto: DemandaUpdateDTO): Observable<DemandaSearchDTO> {
    return this.http.put<DemandaSearchDTO>(`${this.baseUrl}/${id}`, dto);
  }

  alterarStatus(id: number, dto: DemandaStatusDTO): Observable<DemandaSearchDTO> {
    return this.http.put<DemandaSearchDTO>(`${this.baseUrl}/${id}/status`, dto);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  buscarPorId(id: number): Observable<DemandaSearchDTO> {
    return this.http.get<DemandaSearchDTO>(`${this.baseUrl}/${id}`);
  }
}
