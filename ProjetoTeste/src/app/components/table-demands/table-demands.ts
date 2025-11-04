import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DemandService } from '../../core/services/demand.service';
import { Demand } from '../../models/demand.model';

@Component({
  selector: 'app-table-demands',
  standalone: false,
  templateUrl: './table-demands.html',
  styleUrl: './table-demands.css'
})
export class TableDemands implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['creator', 'title', 'status', 'priority', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Demand>([]);
  expandedElement: Demand | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // 🔹 Controle da busca
  searchId = '';
  errorMessage = '';

  constructor(private demandService: DemandService) {}

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

  /** 🔹 Expande / recolhe linha de detalhes */
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

  /** 🔹 Traduz status */
  formatStatus(status: string): string {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'Concluída';
      case 'IN_PROGRESS': return 'Em Progresso';
      case 'PENDING': return 'Pendente';
      case 'CANCELLED': return 'Cancelada';
      default: return status;
    }
  }

  /** 🔹 Formata data */
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

  /** 🔹 Retorna o avatar real ou fallback */
  getAvatarUrl(creator: any): string {
    if (creator?.avatarUrl) return creator.avatarUrl;
    const name = encodeURIComponent(creator?.name || 'Usuário');
    return `https://ui-avatars.com/api/?name=${name}&background=667eea&color=fff&bold=true`;
  }

/** 🔍 Busca demanda por ID ou título */
searchById(): void {
  const query = this.searchId.trim();
  this.errorMessage = '';

  // Se o campo estiver vazio, recarrega tudo
  if (!query) {
    this.loadDemands();
    return;
  }

  // Se for um número → busca pelo ID exato
  if (!isNaN(Number(query))) {
    this.demandService.getDemandById(query).subscribe({
      next: (data) => {
        this.dataSource.data = [data];
        this.expandedElement = null;
        console.log('✅ Demanda encontrada por ID:', data);
      },
      error: (err) => {
        console.error('❌ Erro na busca por ID:', err);
        this.errorMessage = 'Nenhuma demanda encontrada com esse ID.';
      }
    });
    return;
  }

  // Caso contrário → busca por título (parcial)
  this.demandService.getAllDemands().subscribe({
    next: (demands) => {
      const filtered = demands.filter(d =>
        d.title.toLowerCase().includes(query.toLowerCase())
      );
      this.dataSource.data = filtered;
      if (filtered.length === 0) {
        this.errorMessage = 'Nenhuma demanda encontrada com esse título.';
      }
    },
    error: (err) => {
      console.error('❌ Erro na busca por título:', err);
      this.errorMessage = 'Erro ao buscar demandas.';
    }
  });
}

/** 🔄 Limpa o campo e recarrega todas as demandas */
clearSearch(): void {
  this.searchId = '';
  this.errorMessage = '';
  this.loadDemands();
}

filters = {
  term: '',
  status: '',
  priority: ''
};

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

/** 🔍 Visualizar demanda */
viewDemand(demand: Demand, event: MouseEvent): void {
  event.stopPropagation(); // evita abrir a linha expandida
  console.log('👁️ Visualizar demanda:', demand);
}

/** ✅ Atender demanda */
attendDemand(demand: Demand, event: MouseEvent): void {
  event.stopPropagation();
  console.log('⚙️ Atendendo demanda:', demand);
}
}