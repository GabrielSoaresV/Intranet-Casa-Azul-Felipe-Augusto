import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../core/services/message.service';
import { AuthService } from '../../core/services/auth.service';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-page-chat',
  standalone: false,
  templateUrl: './page-chat.html',
  styleUrl: './page-chat.css'
})
export class PageChat implements OnInit {
  chatForm: FormGroup;
  messages: Message[] = [];
  currentUserCpf: string = '';
  currentUserName: string = '';
  demandId: string = '';
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // 🔹 Pega o usuário logado do AuthService
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUserCpf = user.cpf;
      this.currentUserName = user.name;
      console.log('🧍 Usuário logado:', user.name, user.cpf);
    }

    // 🔹 Pega o ID da demanda pela URL
    this.demandId = this.route.snapshot.paramMap.get('id') || '';
    if (this.demandId) {
      this.loadMessages();
    }
  }

  /** 🔹 Carrega as mensagens da demanda */
  loadMessages(): void {
    this.isLoading = true;
    this.messageService.getMessagesByDemand(this.demandId).subscribe({
      next: (data) => {
        this.messages = data;
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('❌ Erro ao carregar mensagens:', err);
        this.isLoading = false;
      }
    });
  }

  /** 🔹 Envia nova mensagem */
  sendMessage(): void {
    if (this.chatForm.invalid) return;

    const msgText = this.chatForm.value.message.trim();
    if (!msgText) return;

    this.messageService.sendMessage(this.demandId, this.currentUserCpf, msgText).subscribe({
      next: (msg) => {
        this.messages.push(msg);
        this.chatForm.reset();
        this.scrollToBottom();
      },
      error: (err) => console.error('❌ Erro ao enviar mensagem:', err)
    });
  }

  /** 🔹 Rola o chat até o fim */
  private scrollToBottom(): void {
    setTimeout(() => {
      const box = document.querySelector('.chat-box');
      if (box) box.scrollTop = box.scrollHeight;
    }, 100);
  }
}
