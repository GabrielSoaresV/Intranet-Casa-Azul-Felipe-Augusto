import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfaceJovem } from '../models/interface-jovem.model'; 

@Injectable({
  providedIn: 'root'
})
export class JovemService {
  private readonly API = 'http://localhost:8080/api/jovens';

  constructor(private http: HttpClient) {}

  listar(): Observable<InterfaceJovem[]> {
    return this.http.get<InterfaceJovem[]>(this.API);
  }

  excluir(matricula: string) {
    return this.http.delete(`${this.API}/${matricula}`);
  }

  atualizarJovem(jovem: InterfaceJovem): Observable<InterfaceJovem> {
    return this.http.put<InterfaceJovem>(`${this.API}/${jovem.matricula}`, jovem);
  }
}
