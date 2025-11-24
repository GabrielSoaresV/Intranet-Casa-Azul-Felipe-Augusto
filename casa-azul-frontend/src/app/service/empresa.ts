import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfaceEmpresa } from '../models/interface-empresa.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private readonly API = `${environment.apiUrl}/api/empresas`;

  constructor(private http: HttpClient) {}

  /** LISTAR TODAS AS EMPRESAS */
  listar(): Observable<InterfaceEmpresa[]> {
    return this.http.get<InterfaceEmpresa[]>(this.API);
  }

  /** BUSCAR EMPRESA PELO CNPJ */
  buscarPorCnpj(cnpj: string): Observable<InterfaceEmpresa> {
    return this.http.get<InterfaceEmpresa>(
      `${this.API}/${encodeURIComponent(cnpj)}`
    );
  }

  /** CADASTRAR NOVA EMPRESA */
  cadastrar(empresa: InterfaceEmpresa): Observable<InterfaceEmpresa> {
    return this.http.post<InterfaceEmpresa>(this.API, empresa);
  }

  /** ATUALIZAR EMPRESA EXISTENTE */
  atualizar(cnpj: string, empresa: InterfaceEmpresa): Observable<InterfaceEmpresa> {
    return this.http.put<InterfaceEmpresa>(
      `${this.API}/${encodeURIComponent(cnpj)}`,
      empresa
    );
  }

  /** EXCLUIR EMPRESA */
  excluir(cnpj: string): Observable<void> {
    return this.http.delete<void>(
      `${this.API}/${encodeURIComponent(cnpj)}`
    );
  }
}
