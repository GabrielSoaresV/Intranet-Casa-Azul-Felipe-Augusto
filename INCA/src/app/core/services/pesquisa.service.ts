import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JovemAprendiz } from '../../models/jovem-aprendiz';

@Injectable({
  providedIn: 'root'
})
export class PesquisaService {

  private api = 'http://192.168.1.22:8082/pesquisa';

  constructor(private http: HttpClient) {}

  buscar(filtro: string): Observable<JovemAprendiz[]> {
    return this.http.get<JovemAprendiz[]>(`${this.api}?filtro=${filtro}`);
  }
}
