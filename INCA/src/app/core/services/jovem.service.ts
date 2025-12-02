import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JovemAprendiz } from '../../models/jovem-aprendiz';

@Injectable({
  providedIn: 'root'
})
export class JovemService {

    private api = 'http://192.168.1.22:8082/api/jovens';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<JovemAprendiz[]> {
    return this.http.get<JovemAprendiz[]>(this.api);
  }

  salvar(jovem: JovemAprendiz): Observable<any> {
    return this.http.post<any>(this.api, jovem);
  }

  buscarPorMatricula(matricula: string): Observable<JovemAprendiz> {
    return this.http.get<JovemAprendiz>(`${this.api}/${matricula}`);
  }

  atualizar(matricula: string, jovem: JovemAprendiz): Observable<JovemAprendiz> {
    return this.http.put<JovemAprendiz>(`${this.api}/${matricula}`, jovem);
  }

  excluir(matricula: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${matricula}`);
  }
}
