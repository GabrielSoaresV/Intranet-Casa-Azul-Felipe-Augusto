import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DemandService } from '../../core/services/demand.service';
import { Demand } from '../../models/demand.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog, ConfirmDialogData} from './confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-table-demands',
  standalone: false,
  templateUrl: './table-demands.html',
  styleUrl: './table-demands.css'
})
export class TableDemands implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['creator', 'title', 'status', 'priority', 'actions'];
  dataSource = new MatTableDataSource<Demand>([]);
  expandedElement: Demand | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  errorMessage = '';
  avatarCache: { [cpf: string]: string } = {};

  constructor(
    private demandService: DemandService,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
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
      error: (err) => {
        console.error('❌ Erro ao carregar demandas:', err);
        this.errorMessage = 'Erro ao carregar demandas.';
      }
    });
  }

  toggleExpand(row: Demand): void {
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  /** ✅ CSS por status (inclui RETURNED) */
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

  /** ✅ Tradução (inclui RETURNED) */
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

  // ----------------------------
  // Filtros
  // ----------------------------
  filters = { term: '', status: '', priority: '' };

  searchDemands(): void {
    this.errorMessage = '';
    this.demandService.searchDemands(this.filters).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.expandedElement = null;
        if (data.length === 0) this.errorMessage = 'Nenhuma demanda encontrada.';
      },
      error: (err) => {
        console.error('❌ Erro na busca:', err);
        this.errorMessage = 'Erro ao buscar demandas.';
      }
    });
  }

  clearFilters(): void {
    this.filters = { term: '', status: '', priority: '' };
    this.loadDemands();
  }

  // ----------------------------
  // Diálogo de confirmação
  // ----------------------------
  private askConfirm(message: string, title?: string, confirmText?: string) {
    const data: ConfirmDialogData = {
      title: title || 'Confirmação',
      message,
      confirmText: confirmText || 'Confirmar'
    };
    const ref = this.dialog.open(ConfirmDialog, {
      width: '360px',
      data
    });
    return ref.afterClosed(); // Observable<boolean>
  }

  // ----------------------------
  // Ações
  // ----------------------------

  /** ✅ Atender demanda (PENDING/RETURNED → IN_PROGRESS) */
  /** ✅ Atender demanda (PENDING/RETURNED → IN_PROGRESS + atribui responsável) */
  attendDemand(demand: Demand, event: MouseEvent): void {
    event.stopPropagation();
    this.askConfirm('Confirmar atendimento desta demanda?', 'Atender Demanda', 'Atender')
      .subscribe(ok => {
        if (!ok) return;

        // O backend descobre o usuário autenticado, então não precisa passar CPF
        this.demandService.assignDemand(demand.id!)
          .subscribe({
            next: (updated) => this.patchRow(updated),
            error: (err) => {
              console.error('❌ Erro ao atender demanda:', err);
              this.errorMessage = err?.error?.message || 'Não foi possível atender a demanda.';
            }
          });
      });
  }


  /** 🔁 Devolver demanda (IN_PROGRESS → RETURNED) */
  returnDemand(demand: Demand, event: MouseEvent): void {
    event.stopPropagation();
    this.askConfirm('Confirmar devolução desta demanda?', 'Devolver Demanda', 'Devolver')
      .subscribe(ok => {
        if (!ok) return;
        this.demandService.updateDemandStatus(demand.id!, 'RETURNED', 'Devolvida pelo atendente')
          .subscribe({
            next: (updated) => this.patchRow(updated),
            error: (err) => {
              console.error('❌ Erro ao devolver:', err);
              this.errorMessage = err?.error?.message || 'Não foi possível devolver a demanda.';
            }
          });
      });
  }

  /** 🗑️ Excluir demanda (somente COMPLETED ou CANCELLED) */
  deleteDemand(demand: Demand, event: MouseEvent): void {
    event.stopPropagation();
    this.askConfirm('Tem certeza que deseja excluir esta demanda?', 'Excluir Demanda', 'Excluir')
      .subscribe(ok => {
        if (!ok) return;

        this.demandService.deleteDemand(demand.id!).subscribe({
          next: (res) => {
            // Remove da tabela sem recarregar tudo
            this.dataSource.data = this.dataSource.data.filter(d => d.id !== demand.id);
          },
          error: (err) => {
            console.error('❌ Erro ao excluir demanda:', err);
            this.errorMessage = err?.error?.message || 'Não foi possível excluir a demanda.';
          }
        });
      });
  }

  /** 🏁 Finalizar demanda (IN_PROGRESS → COMPLETED) */
  completeDemand(demand: Demand, event: MouseEvent): void {
    event.stopPropagation();
    this.askConfirm('Confirmar finalização desta demanda?', 'Finalizar Demanda', 'Finalizar')
      .subscribe(ok => {
        if (!ok) return;
        this.demandService.updateDemandStatus(demand.id!, 'COMPLETED', 'Finalizada pelo atendente')
          .subscribe({
            next: (updated) => this.patchRow(updated),
            error: (err) => {
              console.error('❌ Erro ao finalizar:', err);
              this.errorMessage = err?.error?.message || 'Não foi possível finalizar a demanda.';
            }
          });
      });
  }

  /** 🚫 Cancelar demanda (PENDING ou RETURNED → CANCELLED) */
  cancelDemand(demand: Demand, event: MouseEvent): void {
    event.stopPropagation();
    this.askConfirm('Confirmar cancelamento desta demanda?', 'Cancelar Demanda', 'Cancelar')
      .subscribe(ok => {
        if (!ok) return;
        this.demandService.updateDemandStatus(demand.id!, 'CANCELLED', 'Cancelada pelo atendente')
          .subscribe({
            next: (updated) => this.patchRow(updated),
            error: (err) => {
              console.error('❌ Erro ao cancelar:', err);
              this.errorMessage = err?.error?.message || 'Não foi possível cancelar a demanda.';
            }
          });
      });
  }

  /** 🔧 Atualiza linha sem reload total */
  private patchRow(updated: Demand) {
    const data = this.dataSource.data.slice();
    const idx = data.findIndex(d => d.id === updated.id);
    if (idx >= 0) {
      data[idx] = { ...data[idx], ...updated };
      this.dataSource.data = data;
    }
  }

  /** 💬 Abre chat */
  viewDemand(element: Demand, event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['/chat'], { queryParams: { id: element.id } });
  }

  // ----------------------------
  // Helpers de visibilidade por status
  // ----------------------------
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

}
