import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CidadaoCreateDTO } from '../dtos/dto-cidadaos/cidadao-create.dto';
import { CidadaoUpdateDTO } from '../dtos/dto-cidadaos/cidadao-update.dto';
import { CidadaoSearchDTO } from '../dtos/dto-cidadaos/cidadao-search.dto';

@Injectable({
  providedIn: 'root'
})
export class CidadaoService {
  private baseUrl = 'http://localhost:8080/cidadaos';

  constructor(private http: HttpClient) {}

  listar(): Observable<CidadaoSearchDTO[]> {
    return this.http.get<CidadaoSearchDTO[]>(this.baseUrl);
  }

  buscarPorCpf(cpf: string): Observable<CidadaoSearchDTO> {
    return this.http.get<CidadaoSearchDTO>(`${this.baseUrl}/${cpf}`);
  }

  criar(dto: CidadaoCreateDTO): Observable<CidadaoSearchDTO> {
    return this.http.post<CidadaoSearchDTO>(this.baseUrl, dto);
  }

  atualizar(cpf: string, dto: CidadaoUpdateDTO): Observable<CidadaoSearchDTO> {
    return this.http.put<CidadaoSearchDTO>(`${this.baseUrl}/${cpf}`, dto);
  }

  excluir(cpf: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${cpf}`);
  }

  identificarNome(cpf: string): Observable<string> {
  return this.http.get<string>(`${this.baseUrl}/${cpf}/nome`);
}
}
