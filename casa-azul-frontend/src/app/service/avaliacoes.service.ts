import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfaceJovem } from '../models/interface-jovem.model';


@Injectable({
  providedIn: 'root'
})
export class AvaliacoesService {

  private apiUrl = 'http://backend:8080/api/avaliacoes';

  constructor(private http: HttpClient) {}

  // Salvar avaliação copiando e colando
  salvarAvaliacao(matricula: string, avaliacao: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${matricula}`, avaliacao);
  }

  // Listar avaliações por matrícula
  listarPorJovem(matricula: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/jovem/${matricula}`);
  }

  listarJovem(matricula: string): Observable<InterfaceJovem> {
    return this.http.get<InterfaceJovem>(`http://backend:8080/api/jovens/${matricula}`);
  }
}
