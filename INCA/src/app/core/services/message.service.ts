import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../../models/message.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private apiUrl = `${environment.apiDemanda}/api/messages`;

  constructor(private http: HttpClient) {}

  getMessagesByDemand(demandId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/demand/${demandId}`);
  }

  sendMessage(demandId: string, userCpf: string, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/demand/${demandId}`, {
      message: content,
      user: { cpf: userCpf }
    });
  }
}
