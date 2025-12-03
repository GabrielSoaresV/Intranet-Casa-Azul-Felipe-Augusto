import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Avaliacao } from '../../models/avaliacao';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {

  private apiUrl = `${environment.apiGestao}/api/avaliacoes`

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<Avaliacao[]> {
    return this.http.get<Avaliacao[]>(this.apiUrl);
  }

  listarPorJovem(matricula: string): Observable<Avaliacao[]> {
    return this.http.get<Avaliacao[]>(`${this.apiUrl}/jovem/${matricula}`);
  }

  salvar(matricula: string, avaliacao: Avaliacao): Observable<Avaliacao> {
    return this.http.post<Avaliacao>(`${this.apiUrl}/${matricula}`, avaliacao);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
