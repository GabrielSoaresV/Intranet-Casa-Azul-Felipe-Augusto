import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfaceJovem } from '../models/interface-jovem.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AvaliacoesService {

  private apiUrl = `${environment.apiUrl}/api/avaliacoes`;

  constructor(private http: HttpClient) {}

  salvarAvaliacao(matricula: string, avaliacao: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${matricula}`, avaliacao);
  }

  listarPorJovem(matricula: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/jovem/${matricula}`);
  }

  listarJovem(matricula: string): Observable<InterfaceJovem> {
    return this.http.get<InterfaceJovem>(
      `${environment.apiUrl}/api/jovens/${matricula}`
    );
  }
}
