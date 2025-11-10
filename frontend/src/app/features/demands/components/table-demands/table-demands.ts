import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DemandService } from '../../../../core/services/demand.service';
import { Demand } from '../../../../models/demand.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog, ConfirmDialogData } from '../../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-table-demands',
  standalone: false,
  templateUrl: './table-demands.html',
  styleUrls: ['./table-demands.css']
})
export class TableDemands implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['creator', 'title', 'status', 'priority', 'actions'];
  dataSource = new MatTableDataSource<Demand>([]);
  expandedElement: Demand | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  errorMessage = '';
  avatarCache: { [cpf: string]: string } = {};

  filters = { term: '', status: '', priority: '' };

  constructor(
    private demandService: DemandService,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDemands();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadDemands(): void {
    this.errorMessage = '';
    this.demandService.getAllDemands().subscribe({
      next: (demands) => {
        this.dataSource.data = demands;
        if (this.paginator) this.dataSource.paginator = this.paginator;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar demandas.';
      }
    });
  }

  toggleExpand(row: Demand): void {
    this.expandedElement = this.expandedElement === row ? null : row;
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

  getPriorityClasses(priority: string): string {
    switch (priority?.toUpperCase()) {
      case 'HIGH':   return 'prioridade-alta';
      case 'MEDIUM': return 'prioridade-media';
      case 'LOW':    return 'prioridade-baixa';
      default:       return '';
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

  formatDate(date?: string | Date): string {
    if (!date) return '-';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  getAvatarUrl(profile: any): string {
    if (!profile) return '';
    if (profile.avatar) return `data:image/jpeg;base64,${profile.avatar}`;
    const safeName = encodeURIComponent(profile?.name || 'Usuário');
    return `https://ui-avatars.com/api/?name=${safeName}&background=667eea&color=fff&bold=true`;
  }

  searchDemands(): void {
    this.errorMessage = '';
    this.demandService.searchDemands(this.filters).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.expandedElement = null;
        if (data.length === 0) this.errorMessage = 'Nenhuma demanda encontrada.';
      },
      error: () => {
        this.errorMessage = 'Erro ao buscar demandas.';
      }
    });
  }

  clearFilters(): void {
    this.filters = { term: '', status: '', priority: '' };
    this.loadDemands();
  }

  private askConfirm(message: string, title?: string, confirmText?: string) {
    const data: ConfirmDialogData = {
      title: title || 'Confirmação',
      message,
      confirmText: confirmText || 'Confirmar'
    };
    const ref = this.dialog.open(ConfirmDialog, { width: '360px', data });
    return ref.afterClosed();
  }

  attendDemand(demand: Demand, event: MouseEvent): void {
    event.stopPropagation();
    this.askConfirm('Confirmar atendimento desta demanda?', 'Atender Demanda', 'Atender')
      .subscribe(ok => {
        if (!ok) return;
        this.demandService.assignDemand(demand.id!)
          .subscribe({
            next: (updated) => this.patchRow(updated),
            error: () => {
              this.errorMessage = 'Não foi possível atender a demanda.';
            }
          });
      });
  }

  returnDemand(demand: Demand, event: MouseEvent): void {
    event.stopPropagation();
    this.askConfirm('Confirmar devolução desta demanda?', 'Devolver Demanda', 'Devolver')
      .subscribe(ok => {
        if (!ok) return;
        this.demandService.updateDemandStatus(demand.id!, 'RETURNED', 'Devolvida pelo atendente')
          .subscribe({
            next: (updated) => this.patchRow(updated),
            error: () => {
              this.errorMessage = 'Não foi possível devolver a demanda.';
            }
          });
      });
  }

  deleteDemand(demand: Demand, event: MouseEvent): void {
    event.stopPropagation();
    this.askConfirm('Tem certeza que deseja excluir esta demanda?', 'Excluir Demanda', 'Excluir')
      .subscribe(ok => {
        if (!ok) return;
        this.demandService.deleteDemand(demand.id!).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(d => d.id !== demand.id);
          },
          error: () => {
            this.errorMessage = 'Não foi possível excluir a demanda.';
          }
        });
      });
  }

  completeDemand(demand: Demand, event: MouseEvent): void {
    event.stopPropagation();
    this.askConfirm('Confirmar finalização desta demanda?', 'Finalizar Demanda', 'Finalizar')
      .subscribe(ok => {
        if (!ok) return;
        this.demandService.updateDemandStatus(demand.id!, 'COMPLETED', 'Finalizada pelo atendente')
          .subscribe({
            next: (updated) => this.patchRow(updated),
            error: () => {
              this.errorMessage = 'Não foi possível finalizar a demanda.';
            }
          });
      });
  }

  cancelDemand(demand: Demand, event: MouseEvent): void {
    event.stopPropagation();
    this.askConfirm('Confirmar cancelamento desta demanda?', 'Cancelar Demanda', 'Cancelar')
      .subscribe(ok => {
        if (!ok) return;
        this.demandService.updateDemandStatus(demand.id!, 'CANCELLED', 'Cancelada pelo atendente')
          .subscribe({
            next: (updated) => this.patchRow(updated),
            error: () => {
              this.errorMessage = 'Não foi possível cancelar a demanda.';
            }
          });
      });
  }

  private patchRow(updated: Demand) {
    const data = this.dataSource.data.slice();
    const idx = data.findIndex(d => d.id === updated.id);
    if (idx >= 0) {
      data[idx] = { ...data[idx], ...updated };
      this.dataSource.data = data;
    }
  }

  viewDemand(element: Demand, event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['/chat'], { queryParams: { id: element.id } });
  }

  canAttend(status?: string): boolean {
    const s = status?.toUpperCase();
    return s === 'PENDING' || s === 'RETURNED';
  }

  canReturn(status?: string): boolean {
    return status?.toUpperCase() === 'IN_PROGRESS';
  }

  canComplete(status?: string): boolean {
    return status?.toUpperCase() === 'IN_PROGRESS';
  }

  canCancel(status?: string): boolean {
    const s = status?.toUpperCase();
    return s === 'PENDING' || s === 'RETURNED';
  }

  canDelete(status?: string): boolean {
    const s = status?.toUpperCase();
    return s === 'COMPLETED' || s === 'CANCELLED';
  }

  isAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role?.toUpperCase() === 'ADMIN';
  }
}
