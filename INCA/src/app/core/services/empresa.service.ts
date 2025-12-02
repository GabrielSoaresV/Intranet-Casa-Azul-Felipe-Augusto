import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../../models/empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private api = 'http://192.168.1.22:8082/api/empresas';

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.api);
  }

  salvar(empresa: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.api, empresa);
  }

  atualizar(cnpj: string, empresa: Empresa): Observable<Empresa> {
    return this.http.put<Empresa>(`${this.api}/${cnpj}`, empresa);
  }

  excluir(cnpj: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${cnpj}`);
  }
}
