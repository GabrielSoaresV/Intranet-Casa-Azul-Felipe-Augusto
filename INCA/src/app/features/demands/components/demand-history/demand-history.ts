import { Component, OnInit } from '@angular/core';
import { DemandHistoryService } from '../../../../core/services/demand-history.service';
import { DemandHistory } from '../../../../models/demand-history.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-demand-history',
  standalone: false,
  templateUrl: './demand-history.html',
  styleUrls: ['./demand-history.css']
})
export class DemandHistoryList implements OnInit {
  loading = false;
  searchId = '';
  allHistory: DemandHistory[] = [];
  errorMessage = '';

  constructor(
    private historyService: DemandHistoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const demandId = params.get('id');
      if (demandId) {
        this.searchId = demandId;
        this.searchHistory(false);
      }
    });
  }

  searchHistory(updateUrl: boolean = true): void {
    const trimmedId = this.searchId.trim();
    if (!trimmedId) {
      this.errorMessage = 'Por favor, digite um ID de demanda.';
      this.allHistory = [];
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.allHistory = [];

    this.historyService.getHistoryByDemand(trimmedId).subscribe({
      next: (data) => {
        this.allHistory = data.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        this.loading = false;

        if (data.length === 0) {
          this.errorMessage = 'Nenhum histórico encontrado para essa demanda.';
        }

        if (updateUrl) {
          this.router.navigate(['/history', trimmedId]);
        }
      },
      error: () => {
        this.errorMessage = 'Erro ao buscar o histórico. Verifique o ID.';
        this.loading = false;
      }
    });
  }

  getActionIcon(action: string): string {
    switch (action?.toUpperCase()) {
      case 'CREATED': return 'note_add';
      case 'UPDATED': return 'edit';
      case 'ASSIGNED': return 'person_add';
      case 'RETURNED': return 'undo';
      case 'COMPLETED': return 'check_circle';
      case 'CANCELLED': return 'cancel';
      case 'DELETED': return 'delete_forever';
      default: return 'info';
    }
  }

  getActionClass(action: string): string {
    switch (action?.toUpperCase()) {
      case 'CREATED': return 'action-created';
      case 'UPDATED': return 'action-updated';
      case 'ASSIGNED': return 'action-assigned';
      case 'RETURNED': return 'action-returned';
      case 'COMPLETED': return 'action-completed';
      case 'CANCELLED': return 'action-cancelled';
      case 'DELETED': return 'action-deleted';
      default: return '';
    }
  }

  getActionText(action: string): string {
    switch (action?.toUpperCase()) {
      case 'CREATED': return 'Demanda criada';
      case 'UPDATED': return 'Atualizada';
      case 'ASSIGNED': return 'Atribuída';
      case 'RETURNED': return 'Devolvida';
      case 'COMPLETED': return 'Concluída';
      case 'CANCELLED': return 'Cancelada';
      case 'DELETED': return 'Excluída';
      default: return 'Alteração';
    }
  }

  translateStatus(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'Pendente';
      case 'IN_PROGRESS': return 'Em andamento';
      case 'RETURNED': return 'Devolvida';
      case 'COMPLETED': return 'Concluída';
      case 'CANCELLED': return 'Cancelada';
      default: return status || '—';
    }
  }

  formatDateTime(date?: string | Date): string {
    if (!date) return '—';
    const d = new Date(date);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getUserName(history: DemandHistory): string {
    return history?.performedBy?.name || 'Usuário desconhecido';
  }

  getAvatarUrl(history: DemandHistory): string {
    const user = history?.performedBy;
    if (user?.avatar) return `data:image/jpeg;base64,${user.avatar}`;
    const name = encodeURIComponent(user?.name || 'Usuário');
    return `https://ui-avatars.com/api/?name=${name}&background=667eea&color=fff&bold=true`;
  }
}
