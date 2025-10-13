import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandaCreateDTO } from '../dtos/dto-demandas/demanda-create.dto';
import { DemandaUpdateDTO } from '../dtos/dto-demandas/demanda-update.dto';
import { DemandaStatusDTO } from '../dtos/dto-demandas/demanda-status.dto';
import { InterfaceDemanda } from '../models/demanda.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class DemandaService {
  private baseUrl = 'http://localhost:8080/demandas';

  constructor(private http: HttpClient) {}

  listar(): Observable<ApiResponse<InterfaceDemanda[]>> {
    return this.http.get<ApiResponse<InterfaceDemanda[]>>(this.baseUrl);
  }

  listarPorCidadao(cpf: string): Observable<ApiResponse<InterfaceDemanda[]>> {
    return this.http.get<ApiResponse<InterfaceDemanda[]>>(`${this.baseUrl}/cidadao/${cpf}`);
  }

  criar(dto: DemandaCreateDTO): Observable<ApiResponse<InterfaceDemanda>> {
    return this.http.post<ApiResponse<InterfaceDemanda>>(this.baseUrl, dto);
  }

  atualizar(id: number, dto: DemandaUpdateDTO): Observable<ApiResponse<InterfaceDemanda>> {
    return this.http.put<ApiResponse<InterfaceDemanda>>(`${this.baseUrl}/${id}`, dto);
  }

  alterarStatus(id: number, dto: DemandaStatusDTO): Observable<ApiResponse<InterfaceDemanda>> {
    return this.http.put<ApiResponse<InterfaceDemanda>>(`${this.baseUrl}/${id}/status`, dto);
  }

  excluir(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
  }

  buscarPorId(id: number): Observable<ApiResponse<InterfaceDemanda>> {
    return this.http.get<ApiResponse<InterfaceDemanda>>(`${this.baseUrl}/${id}`);
  }
}
