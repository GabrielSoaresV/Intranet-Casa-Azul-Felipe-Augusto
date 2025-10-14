// MessagesService.mock.ts
import { Injectable } from '@angular/core';
import { Message } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  async getMessages(demandId: string): Promise<Message[]> {
    console.log('MessagesService.getMessages chamado', demandId);
    return [];
  }

  async sendMessage(demandId: string, message: string): Promise<Message> {
    console.log('MessagesService.sendMessage chamado', demandId, message);
    return {} as Message;
  }

  subscribeToMessages(demandId: string, callback: (message: Message) => void): void {
    console.log('MessagesService.subscribeToMessages chamado', demandId);
  }

  unsubscribeFromMessages(demandId: string): void {
    console.log('MessagesService.unsubscribeFromMessages chamado', demandId);
  }
}
