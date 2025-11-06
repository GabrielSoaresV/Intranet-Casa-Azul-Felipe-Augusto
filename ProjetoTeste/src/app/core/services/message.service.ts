import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:8080/api/messages'; // 🔹 coloque o URL absoluto pra evitar CORS em dev

  constructor(private http: HttpClient) {}

  /** 🔹 Busca todas as mensagens da demanda */
  getMessagesByDemand(demandId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/demand/${demandId}`);
  }

  /** 🔹 Envia uma nova mensagem */
  sendMessage(demandId: string, userCpf: string, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/demand/${demandId}`, {
      message: content,
      user: { cpf: userCpf }
    });
  }
}
