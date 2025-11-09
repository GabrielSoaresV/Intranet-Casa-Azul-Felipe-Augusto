import { Component, OnInit } from '@angular/core';
import { DemandService } from '../../core/services/demand.service';
import { AuthService } from '../../core/services/auth.service';
import { Demand } from '../../models/demand.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demands-list',
  standalone: false,
  templateUrl: './demands-list.html',
  styleUrls: ['./demands-list.css']
})
export class DemandsList implements OnInit {
  loading = true;
  demands: Demand[] = [];
  expandedDemand: Demand | null = null;
  errorMessage = '';
  userCpf = '';

  constructor(
    private demandService: DemandService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user?.cpf) {
      this.errorMessage = 'Usuário sem CPF cadastrado.';
      this.loading = false;
      return;
    }

    this.userCpf = user.cpf;
    this.loadDemands();
  }

  loadDemands(): void {
    this.loading = true;
    this.demandService.getDemandsByCreator(this.userCpf).subscribe({
      next: (data) => {
        this.demands = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erro ao carregar demandas:', err);
        this.errorMessage = 'Erro ao carregar suas demandas.';
        this.loading = false;
      }
    });
  }

  toggleExpand(demand: Demand): void {
    this.expandedDemand = this.expandedDemand === demand ? null : demand;
  }

  openChat(demandId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['/chat', demandId]);
  }

  formatDate(date?: string | Date): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusClasses(status: string): string {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':   return 'status-completed';
      case 'IN_PROGRESS': return 'status-in_progress';
      case 'RETURNED':    return 'status-returned';
      case 'PENDING':     return 'status-pending';
      case 'CANCELLED':   return 'status-cancelled';
      default:            return '';
    }
  }

  formatStatus(status: string): string {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':   return 'Concluída';
      case 'IN_PROGRESS': return 'Em andamento';
      case 'RETURNED':    return 'Devolvida';
      case 'PENDING':     return 'Pendente';
      case 'CANCELLED':   return 'Cancelada';
      default:            return status;
    }
  }
}
