import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JovemAprendiz } from '../../models/jovem-aprendiz';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PesquisaService {

  private apiUrl = `${environment.apiGestao}/pesquisa`;

  constructor(private http: HttpClient) {}

  buscar(filtro: string): Observable<JovemAprendiz[]> {
    return this.http.get<JovemAprendiz[]>(`${this.apiUrl}?filtro=${filtro}`);
  }
}
