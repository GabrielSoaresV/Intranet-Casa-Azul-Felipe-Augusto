import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CidadaoCreateDTO } from '../dtos/dto-cidadaos/cidadao-create.dto';
import { CidadaoUpdateDTO } from '../dtos/dto-cidadaos/cidadao-update.dto';
import { InterfaceCidadao } from '../models/cidadao.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CidadaoService {
  private baseUrl = 'http://localhost:8080/cidadaos';

  constructor(private http: HttpClient) {}

  listar(): Observable<ApiResponse<InterfaceCidadao[]>> {
    return this.http.get<ApiResponse<InterfaceCidadao[]>>(this.baseUrl);
  }

  buscarPorCpf(cpf: string): Observable<ApiResponse<InterfaceCidadao>> {
    return this.http.get<ApiResponse<InterfaceCidadao>>(`${this.baseUrl}/${cpf}`);
  }

  criar(dto: CidadaoCreateDTO): Observable<ApiResponse<InterfaceCidadao>> {
    return this.http.post<ApiResponse<InterfaceCidadao>>(this.baseUrl, dto);
  }

  atualizar(cpf: string, dto: CidadaoUpdateDTO): Observable<ApiResponse<InterfaceCidadao>> {
    return this.http.put<ApiResponse<InterfaceCidadao>>(`${this.baseUrl}/${cpf}`, dto);
  }

  excluir(cpf: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${cpf}`);
  }
}
