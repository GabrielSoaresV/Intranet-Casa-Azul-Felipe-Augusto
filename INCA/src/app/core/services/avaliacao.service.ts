import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Avaliacao } from '../../models/avaliacao';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {

  private api = 'http://api-gestao:8082/api/avaliacoes';

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<Avaliacao[]> {
    return this.http.get<Avaliacao[]>(this.api);
  }

  listarPorJovem(matricula: string): Observable<Avaliacao[]> {
    return this.http.get<Avaliacao[]>(`${this.api}/jovem/${matricula}`);
  }

  salvar(matricula: string, avaliacao: Avaliacao): Observable<Avaliacao> {
    return this.http.post<Avaliacao>(`${this.api}/${matricula}`, avaliacao);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
