import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DemandService } from '../../../core/services/demand.service';
import { MessageService } from '../../../core/services/message.service';
import { DemandHistoryService } from '../../../core/services/demand-history.service';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { Demand } from '../../../shared/models/demand.model';
import { Message } from '../../../shared/models/message.model';
import { DemandHistory } from '../../../shared/models/demand-history.model';
import { Profile } from '../../../shared/models/profile.model';

@Component({
  selector: 'app-demand-detail',
  standalone: false,
  templateUrl: './demand-detail.component.html',
  styleUrls: ['./demand-detail.component.css']
})
export class DemandDetailComponent implements OnInit {
  demand: Demand | null = null;
  messages: Message[] = [];
  history: DemandHistory[] = [];
  attendants: Profile[] = [];

  messageForm!: FormGroup;
  loading = false;
  sendingMessage = false;

  currentUser: Profile | null = null;
  showHistory = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private demandService: DemandService,
    private messageService: MessageService,
    private historyService: DemandHistoryService,
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();

    this.messageForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(1)]]
    });

    const demandId = this.route.snapshot.paramMap.get('id');
    if (demandId) {
      this.loadDemandDetails(demandId);
      this.loadMessages(demandId);
      this.loadHistory(demandId);
    }

    if (this.canManageDemand()) {
      this.loadAttendants();
    }
  }

  loadDemandDetails(id: string) {
    this.loading = true;
    this.demandService.getDemandById(id).subscribe({
      next: (demand) => {
        this.demand = demand;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading demand:', error);
        this.loading = false;
        this.router.navigate(['/demands']);
      }
    });
  }

  loadMessages(demandId: string) {
    this.messageService.getMessagesByDemand(demandId).subscribe({
      next: (messages) => {
        this.messages = messages;
      },
      error: (error) => {
        console.error('Error loading messages:', error);
      }
    });
  }

  loadHistory(demandId: string) {
    this.historyService.getHistoryByDemand(demandId).subscribe({
      next: (history) => {
        this.history = history;
      },
      error: (error) => {
        console.error('Error loading history:', error);
      }
    });
  }

  loadAttendants() {
    this.profileService.getAllProfiles().subscribe({
      next: (profiles) => {
        this.attendants = profiles.filter(p => p.role === 'ATTENDANT' || p.role === 'ADMIN');
      },
      error: (error) => {
        console.error('Error loading attendants:', error);
      }
    });
  }

  sendMessage() {
    if (this.messageForm.invalid || !this.demand?.id || !this.currentUser) {
      return;
    }

    this.sendingMessage = true;
    const messageText = this.messageForm.value.message;

    this.messageService.sendMessage(this.demand.id, messageText, this.currentUser.cpf).subscribe({
      next: (message) => {
        this.messages.push(message);
        this.messageForm.reset();
        this.sendingMessage = false;
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.sendingMessage = false;
      }
    });
  }

  updateStatus(status: string) {
    if (!this.demand?.id) return;

    this.demandService.updateDemandStatus(this.demand.id, status).subscribe({
      next: (updatedDemand) => {
        this.demand = updatedDemand;
        this.loadHistory(this.demand.id!);
      },
      error: (error) => {
        console.error('Error updating status:', error);
      }
    });
  }

  assignToAttendant(cpf: string) {
    if (!this.demand?.id) return;

    this.demandService.assignDemand(this.demand.id, cpf).subscribe({
      next: (updatedDemand) => {
        this.demand = updatedDemand;
        this.loadHistory(this.demand.id!);
      },
      error: (error) => {
        console.error('Error assigning demand:', error);
      }
    });
  }

  toggleHistory() {
    this.showHistory = !this.showHistory;
  }

  canManageDemand(): boolean {
    return this.authService.isAdmin() || this.authService.isAttendant();
  }

  goBack() {
    this.router.navigate(['/demands']);
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'PENDING': 'Pendente',
      'IN_PROGRESS': 'Em Andamento',
      'COMPLETED': 'Concluída',
      'CANCELLED': 'Cancelada'
    };
    return labels[status] || status;
  }

  getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      'LOW': 'Baixa',
      'MEDIUM': 'Média',
      'HIGH': 'Alta'
    };
    return labels[priority] || priority;
  }

  getActionLabel(action: string): string {
    const labels: { [key: string]: string } = {
      'CREATED': 'Criada',
      'UPDATED': 'Atualizada',
      'ASSIGNED': 'Atribuída',
      'COMPLETED': 'Concluída',
      'CANCELLED': 'Cancelada'
    };
    return labels[action] || action;
  }
}
