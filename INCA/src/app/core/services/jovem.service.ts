import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JovemAprendiz } from '../../models/jovem-aprendiz';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class JovemService {

  private apiUrl = `${environment.apiGestao}/api/jovens`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<JovemAprendiz[]> {
    return this.http.get<JovemAprendiz[]>(this.apiUrl);
  }

  salvar(jovem: JovemAprendiz): Observable<any> {
    return this.http.post<any>(this.apiUrl, jovem);
  }

  buscarPorMatricula(matricula: string): Observable<JovemAprendiz> {
    return this.http.get<JovemAprendiz>(`${this.apiUrl}/${matricula}`);
  }

  atualizar(matricula: string, jovem: JovemAprendiz): Observable<JovemAprendiz> {
    return this.http.put<JovemAprendiz>(`${this.apiUrl}/${matricula}`, jovem);
  }

  excluir(matricula: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${matricula}`);
  }

  searchJovens(filters: any) {
    return this.http.post<JovemAprendiz[]>(
      `${this.apiUrl}/search`,
      filters
    );
  }
    
}
