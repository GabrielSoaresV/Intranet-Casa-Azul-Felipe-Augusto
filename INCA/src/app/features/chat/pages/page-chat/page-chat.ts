import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../../../core/services/message.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Message } from '../../../../models/message.model';
import { Demand } from '../../../../models/demand.model';
import { DemandService } from '../../../../core/services/demand.service';

@Component({
  selector: 'app-page-chat',
  standalone: false,
  templateUrl: './page-chat.html',
  styleUrls: ['./page-chat.css']
})
export class PageChat implements OnInit {
  chatForm: FormGroup;
  messages: Message[] = [];
  currentUserCpf = '';
  currentUserName = '';
  demandId = '';
  demandTitle = '';
  isLoading = true;

  private avatarCache: Record<string, string> = {};
  private colorMap = new Map<string, string>();
  private palette = ['bubble-blue', 'bubble-green', 'bubble-orange', 'bubble-purple', 'bubble-teal', 'bubble-rose'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private demandService: DemandService,
    private authService: AuthService
  ) {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser?.();
    if (user) {
      this.currentUserCpf = user.cpf;
      this.currentUserName = user.name;
    }

    this.demandId = this.route.snapshot.paramMap.get('id') || '';
    if (this.demandId) {
      this.loadDemand();
      this.loadMessages();
    }
  }

  private loadDemand(): void {
    this.demandService.getDemandById(this.demandId).subscribe({
      next: (demand: Demand) => {
        this.demandTitle = demand?.title || '(Sem título)';
      },
      error: () => {
        this.demandTitle = '(Erro ao carregar título)';
      }
    });
  }

  private loadMessages(): void {
    this.isLoading = true;
    this.messageService.getMessagesByDemand(this.demandId).subscribe({
      next: (data) => {
        this.messages = data ?? [];
        const cpfs = Array.from(new Set(this.messages.map(m => m.user?.cpf).filter(Boolean) as string[]));
        cpfs.forEach(cpf => this.getBubbleClass(cpf));
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  sendMessage(): void {
    if (this.chatForm.invalid) return;
    const msgText = (this.chatForm.value.message || '').trim();
    if (!msgText) return;

    this.messageService.sendMessage(this.demandId, this.currentUserCpf, msgText).subscribe({
      next: (msg) => {
        this.messages.push(msg);
        if (msg?.user?.cpf) this.getBubbleClass(msg.user.cpf);
        this.chatForm.reset();
        this.scrollToBottom();
      }
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const box = document.querySelector('.chat-box') as HTMLElement | null;
      if (box) box.scrollTop = box.scrollHeight;
    }, 80);
  }

  getAvatarUrlCached(user: any): string {
    if (!user) return this.fallbackAvatar('Usuário');
    const cpf = user.cpf || '';
    if (this.avatarCache[cpf]) return this.avatarCache[cpf];

    if (user.avatar) {
      const url = `data:image/jpeg;base64,${user.avatar}`;
      this.avatarCache[cpf] = url;
      return url;
    }

    const url = this.fallbackAvatar(user.name);
    this.avatarCache[cpf] = url;
    return url;
  }

  private fallbackAvatar(name?: string): string {
    const safe = encodeURIComponent(name || 'Usuário');
    return `https://ui-avatars.com/api/?name=${safe}&background=667eea&color=fff&bold=true`;
  }

  getBubbleClass(cpf?: string | null): string {
    if (!cpf) return this.palette[0];
    if (cpf === this.currentUserCpf) return '';
    if (this.colorMap.has(cpf)) return this.colorMap.get(cpf)!;

    const idx = this.hashCPF(cpf) % this.palette.length;
    const cls = this.palette[Math.abs(idx)];
    this.colorMap.set(cpf, cls);
    return cls;
  }

  private hashCPF(cpf: string): number {
    let h = 0;
    for (let i = 0; i < cpf.length; i++) {
      h = (h << 5) - h + cpf.charCodeAt(i);
      h |= 0;
    }
    return h;
  }
}
