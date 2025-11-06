import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DemandService } from '../../core/services/demand.service';
import { Demand } from '../../models/demand.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  // 🔹 Controle de busca e erro
  searchId = '';
  errorMessage = '';

  // 🔹 Cache de avatares (para evitar requisições repetidas)
  avatarCache: { [cpf: string]: string } = {};

  constructor(
    private demandService: DemandService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDemands();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  /** 🔹 Carrega todas as demandas */
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

  /** 🔹 Expande / recolhe detalhes da linha */
  toggleExpand(row: Demand): void {
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  /** 🔹 Classe CSS conforme status */
  getStatusClasses(status: string): string {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'status-completed';
      case 'IN_PROGRESS': return 'status-in_progress';
      case 'PENDING': return 'status-pending';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }

  /** 🔹 Classe CSS conforme prioridade */
  getPriorityClasses(priority: string): string {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return 'prioridade-alta';
      case 'MEDIUM': return 'prioridade-media';
      case 'LOW': return 'prioridade-baixa';
      default: return '';
    }
  }

  /** 🔹 Traduz status para português */
  formatStatus(status: string): string {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'Concluída';
      case 'IN_PROGRESS': return 'Em andamento';
      case 'PENDING': return 'Pendente';
      case 'CANCELLED': return 'Cancelada';
      default: return status;
    }
  }

  /** 🔹 Formata data para formato brasileiro */
  formatDate(date?: string | Date): string {
    if (!date) return '-';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // ======================================================
  // 🖼️ AVATARES DE CRIADORES
  // ======================================================

  /** 🔹 Retorna avatar do criador */
  getAvatarUrl(profile: any): string {
  if (!profile) return '';

  // Se o backend já mandou o avatar em Base64
  if (profile.avatar) {
    return `data:image/jpeg;base64,${profile.avatar}`;
  }

  // Caso não tenha imagem
  const safeName = encodeURIComponent(profile?.name || 'Usuário');
  return `https://ui-avatars.com/api/?name=${safeName}&background=667eea&color=fff&bold=true`;
}


  /** 🔹 Gera avatar padrão com iniciais */
  getFallbackAvatar(name: string): string {
    const safeName = encodeURIComponent(name || 'Usuário');
    return `https://ui-avatars.com/api/?name=${safeName}&background=667eea&color=fff&bold=true`;
  }

  // ======================================================
  // 🔍 BUSCAS E FILTROS
  // ======================================================

  filters = {
    term: '',
    status: '',
    priority: ''
  };

  /** 🔹 Busca demandas com filtros */
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

  /** 🔹 Limpa filtros e recarrega todas */
  clearFilters(): void {
    this.filters = { term: '', status: '', priority: '' };
    this.loadDemands();
  }

  // ======================================================
  // ⚙️ AÇÕES
  // ======================================================

  /** ✅ Atender demanda */
  attendDemand(demand: Demand, event: MouseEvent): void {
    event.stopPropagation();
    console.log('⚙️ Atendendo demanda:', demand);
    // Aqui você pode implementar o método de "atender" no backend futuramente
  }

  /** 💬 Visualizar detalhes da demanda (abre chat) */
  viewDemand(element: Demand, event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['/chat'], { queryParams: { id: element.id } });
  }
}
