import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { DemandsService } from '../../services/demands.service';
import { MessagesService } from '../../services/messages.service';
import { ProfileService } from '../../services/profile.service';
import { SupabaseService } from '../../services/supabase.service';
import { Demand, Message, Profile } from '../../models/types';

@Component({
  selector: 'app-demand-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './demand-detail.component.html',
  styleUrls: ['./demand-detail.component.css']
})
export class DemandDetailComponent implements OnInit, OnDestroy {
  demand: Demand | null = null;
  messages: Message[] = [];
  currentProfile: Profile | null = null;
  newMessage = '';
  loading = true;
  sendingMessage = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private demandsService: DemandsService,
    private messagesService: MessagesService,
    private profileService: ProfileService,
    private supabase: SupabaseService
  ) {}

  async ngOnInit() {
    const demandId = this.route.snapshot.paramMap.get('id');
    if (demandId) {
      await this.loadDemand(demandId);
      await this.loadMessages(demandId);
      await this.loadProfile();
      this.subscribeToMessages(demandId);
    }
  }

  ngOnDestroy() {
    if (this.demand) {
      this.messagesService.unsubscribeFromMessages(this.demand.id);
    }
  }

  async loadDemand(id: string) {
    try {
      this.demand = await this.demandsService.getDemandById(id);
    } catch (error) {
      console.error('Erro ao carregar demanda:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadMessages(demandId: string) {
    try {
      this.messages = await this.messagesService.getMessages(demandId);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  }

  async loadProfile() {
    try {
      this.currentProfile = await this.profileService.getCurrentProfile();
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  }

  subscribeToMessages(demandId: string) {
    this.messagesService.subscribeToMessages(demandId, (message) => {
      this.messages.push(message);
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  async sendMessage() {
    if (!this.newMessage.trim() || !this.demand) return;

    this.sendingMessage = true;
    try {
      await this.messagesService.sendMessage(this.demand.id, this.newMessage);
      this.newMessage = '';
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      this.sendingMessage = false;
    }
  }

  async assignToMe() {
    if (!this.demand) return;

    const user = this.supabase.getCurrentUser();
    if (!user) return;

    try {
      await this.demandsService.assignDemand(this.demand.id, user.id);
      await this.loadDemand(this.demand.id);
    } catch (error) {
      console.error('Erro ao atribuir demanda:', error);
    }
  }

  async updateStatus(newStatus: string) {
    if (!this.demand) return;

    try {
      await this.demandsService.updateDemandStatus(this.demand.id, newStatus);
      await this.loadDemand(this.demand.id);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  }

  isMyMessage(message: Message): boolean {
    return message.user_id === this.supabase.getCurrentUser()?.id;
  }

  scrollToBottom() {
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'Pendente',
      'in_progress': 'Em Andamento',
      'completed': 'Concluída',
      'cancelled': 'Cancelada'
    };
    return statusMap[status] || status;
  }

  getPriorityText(priority: string): string {
    const priorityMap: Record<string, string> = {
      'low': 'Baixa',
      'medium': 'Média',
      'high': 'Alta'
    };
    return priorityMap[priority] || priority;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  formatTime(date: string): string {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
