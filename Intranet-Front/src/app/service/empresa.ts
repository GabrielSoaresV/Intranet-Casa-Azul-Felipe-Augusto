import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfaceEmpresa } from '../models/interface-empresa.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private readonly API = 'http://localhost:8080/api/empresas';

  constructor(private http: HttpClient) {}

  listar(): Observable<InterfaceEmpresa[]> {
    return this.http.get<InterfaceEmpresa[]>(this.API);
  }

  excluir(cnpj: string) {
    return this.http.delete(`${this.API}/${encodeURIComponent(cnpj)}`);
  }

  atualizarEmpresa(empresa: InterfaceEmpresa): Observable<InterfaceEmpresa> {
    return this.http.put<InterfaceEmpresa>(`${this.API}/${encodeURIComponent(empresa.cnpj)}`, empresa);
  }
}



