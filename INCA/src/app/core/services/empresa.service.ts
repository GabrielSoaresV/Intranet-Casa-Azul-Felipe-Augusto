import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../../models/empresa';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private apiUrl = `${environment.apiGestao}/api/empresas`;

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.apiUrl);
  }

  salvar(empresa: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiUrl, empresa);
  }

  atualizar(cnpj: string, empresa: Empresa): Observable<Empresa> {
    return this.http.put<Empresa>(`${this.apiUrl}/${cnpj}`, empresa);
  }

  excluir(cnpj: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cnpj}`);
  }
}
