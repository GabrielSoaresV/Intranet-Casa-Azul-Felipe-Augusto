import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CidadaoModel } from '../models/cidadao.model';

@Injectable({
  providedIn: 'root'
})
export class CidadaoService {

  private baseUrl = 'http://localhost:8080/cidadaos';

  constructor(private http: HttpClient) { }

  listar(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  buscarPorCpf(cpf: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${cpf}`);
  }

  criar(cidadao: CidadaoModel): Observable<any> {
    return this.http.post<any>(this.baseUrl, cidadao);
  }

  atualizar(cpf: string, cidadao: CidadaoModel): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${cpf}`, cidadao);
  }

  excluir(cpf: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${cpf}`);
  }
}
