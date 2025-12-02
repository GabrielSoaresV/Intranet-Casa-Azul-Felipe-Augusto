import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JovemAprendiz } from '../../models/jovem-aprendiz';

@Injectable({
  providedIn: 'root'
})
export class PesquisaService {

  private api = 'http://api-gestao:8082/pesquisa';

  constructor(private http: HttpClient) {}

  buscar(filtro: string): Observable<JovemAprendiz[]> {
    return this.http.get<JovemAprendiz[]>(`${this.api}?filtro=${filtro}`);
  }
}
