import { Component, OnInit } from '@angular/core';
import { DemandService } from '../../../../core/services/demand.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Demand } from '../../../../models/demand.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog, ConfirmDialogData } from '../../../../shared/confirm-dialog/confirm-dialog';

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
    private router: Router,
    private dialog: MatDialog
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
      error: () => {
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

  deleteDemand(demand: Demand, event: MouseEvent): void {
    event.stopPropagation();

    const dialogData: ConfirmDialogData = {
      title: 'Excluir Demanda',
      message: `Tem certeza de que deseja excluir a demanda? Esta ação é irreversível.`,
      confirmText: 'Excluir',
    };

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '360px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.demandService.deleteDemand(demand.id!).subscribe({
        next: () => {
          this.demands = this.demands.filter(d => d.id !== demand.id);
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Não foi possível excluir a demanda.';
        }
      });
    });
  }

  canDelete(status?: string): boolean {
    const s = status?.toUpperCase();
    return s === 'COMPLETED' || s === 'CANCELLED';
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
