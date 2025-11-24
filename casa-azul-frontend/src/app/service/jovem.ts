import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfaceJovem } from '../models/interface-jovem.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JovemService {

  private readonly API = `${environment.apiUrl}/api/jovens`;

  constructor(private http: HttpClient) {}

  listar(): Observable<InterfaceJovem[]> {
    return this.http.get<InterfaceJovem[]>(this.API);
  }

  excluir(matricula: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${matricula}`);
  }

  atualizarJovem(jovem: InterfaceJovem): Observable<InterfaceJovem> {
    return this.http.put<InterfaceJovem>(`${this.API}/${jovem.matricula}`, jovem);
  }

  cadastrar(jovem: InterfaceJovem): Observable<InterfaceJovem> {
    return this.http.post<InterfaceJovem>(this.API, jovem);
  }
}
