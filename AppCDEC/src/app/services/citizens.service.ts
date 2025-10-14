import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Citizen } from '../models/types';
import { Observable } from 'rxjs';
import { CidadaoDTO } from '../dtos/cidadao.dto';
import { ApiResponse } from '../response/api-response.dto';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CitizensService {
  private apiUrl = 'http://localhost:8080/cidadaos'; // substitua pelo seu backend

  constructor(private http: HttpClient) {}

  getAllCitizens(): Observable<CidadaoDTO[]> {
    return this.http.get<ApiResponse<CidadaoDTO[]>>(this.apiUrl)
      .pipe(map(response => response.data)); // retorna apenas os dados do DTO
  }

  getCitizenById(id: string): Observable<Citizen> {
    console.log('CitizensService.getCitizenById chamado para ID:', id);
    return this.http.get<Citizen>(`${this.apiUrl}/${id}`);
  }

  createCitizen(citizen: Omit<Citizen, 'id' | 'created_at'>): Observable<Citizen> {
    console.log('CitizensService.createCitizen chamado com dados:', citizen);
    return this.http.post<Citizen>(this.apiUrl, citizen);
  }

  updateCitizen(id: string, updates: Partial<Citizen>): Observable<Citizen> {
    console.log('CitizensService.updateCitizen chamado para ID:', id, 'com updates:', updates);
    return this.http.put<Citizen>(`${this.apiUrl}/${id}`, updates);
  }

  deleteCitizen(id: string): Observable<void> {
    console.log('CitizensService.deleteCitizen chamado para ID:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
