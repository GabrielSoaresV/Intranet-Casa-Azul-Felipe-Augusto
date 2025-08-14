import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JovemAprendiz } from '../models/jovem-aprendiz.model';  // Importa a interface certa

@Injectable({
  providedIn: 'root'
})
export class JovemService {
  private readonly API = 'http://localhost:8080/api/jovens';

  constructor(private http: HttpClient) {}

  listar(): Observable<JovemAprendiz[]> {
    return this.http.get<JovemAprendiz[]>(this.API);
  }
  
  excluir(matricula: string) {
    return this.http.delete(`${this.API}/${matricula}`);
  }

  atualizarJovem(jovem: JovemAprendiz): Observable<JovemAprendiz> {
    return this.http.put<JovemAprendiz>(`${this.API}/${encodeURIComponent(jovem.matricula)}`, jovem);
  }
}
