import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../../shared/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = '/api/messages';

  constructor(private http: HttpClient) {}

  getMessagesByDemand(demandId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/demand/${demandId}`);
  }

  sendMessage(demandId: string, message: string, userCpf: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/demand/${demandId}`, {
      message,
      user: { cpf: userCpf }
    });
  }
}
