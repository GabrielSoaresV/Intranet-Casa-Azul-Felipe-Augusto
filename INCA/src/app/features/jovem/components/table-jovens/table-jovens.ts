import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { JovemService } from '../../../../core/services/jovem.service';
import { JovemAprendiz } from '../../../../models/jovem-aprendiz';
import { Router } from '@angular/router';
import { EmailService } from '../../../../core/services/email.service';

@Component({
  selector: 'app-table-jovens',
  standalone: false,
  templateUrl: './table-jovens.html',
  styleUrls: ['./table-jovens.css']
})
export class TableJovens implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'status',
    'nome',
    'matricula',
    'contratacao',
    'empresa',
    'actions'
  ];

  dataSource = new MatTableDataSource<JovemAprendiz>([]);
  expandedElement: JovemAprendiz | null = null;

  searchTerm = '';
  errorMessage = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private jovemService: JovemService,
    private emailService: EmailService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadJovens();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadJovens(): void {
    this.jovemService.listarTodos().subscribe({
      next: jovens => {
        this.dataSource.data = jovens;
      },
      error: () => this.errorMessage = 'Erro ao carregar jovens.'
    });
  }

  applyFilter(): void {
    const filter = this.searchTerm.trim().toLowerCase();

    this.dataSource.filterPredicate = (j: JovemAprendiz, f: string): boolean => {
      return (
        (j.nome?.toLowerCase() ?? '').includes(f) ||
        (j.matricula?.toLowerCase() ?? '').includes(f) ||
        (j.empresa?.nomeEmpresa?.toLowerCase() ?? '').includes(f)
      );
    };

    this.dataSource.filter = filter;
  }

  clearFilter(): void {
    this.searchTerm = '';
    this.dataSource.filter = '';
  }

  toggleExpand(jovem: JovemAprendiz): void {
    this.expandedElement = this.expandedElement === jovem ? null : jovem;
  }

  // ============================================================
  // 🔥 STATUS COLORIDO: VERDE / AMARELO / VERMELHO
  // ============================================================
  getStatusClass(j: JovemAprendiz): string {
    if (!j.periodoAvaliacao) return '';

    const periodoMeses = Number(j.periodoAvaliacao);
    const hoje = new Date();

    const base = j.ultimaAvaliacao
      ? new Date(j.ultimaAvaliacao)
      : new Date(j.contratacao!);

    const proxima = new Date(base);
    proxima.setMonth(proxima.getMonth() + periodoMeses);

    const diff = Math.ceil((proxima.getTime() - hoje.getTime()) / 86400000);

    if (diff < 0) return 'status-vermelho';
    if (diff <= 7) return 'status-vermelho';
    if (diff <= 30) return 'status-amarelo';

    return 'status-verde';
  }

  getStatusInfo(j: JovemAprendiz): string {
    if (!j.periodoAvaliacao) return '';

    const periodoMeses = Number(j.periodoAvaliacao);
    const hoje = new Date();

    const base = j.ultimaAvaliacao
      ? new Date(j.ultimaAvaliacao)
      : new Date(j.contratacao!);

    const proxima = new Date(base);
    proxima.setMonth(proxima.getMonth() + periodoMeses);

    const diff = Math.ceil((proxima.getTime() - hoje.getTime()) / 86400000);

    if (diff < 0) return `Atrasado há ${Math.abs(diff)} dias`;
    if (diff === 0) return 'Vence hoje';
    if (diff === 1) return 'Vence amanhã';
    if (diff <= 7) return `Faltam ${diff} dias (atenção)`;
    if (diff <= 30) return `Próxima em ${diff} dias`;

    return `${diff} dias restantes`;
  }

  getDiasParaProximaAvaliacao(j: JovemAprendiz): number | null {
    if (!j.periodoAvaliacao) return null;

    const periodoMeses = Number(j.periodoAvaliacao);

    const base = j.ultimaAvaliacao
      ? new Date(j.ultimaAvaliacao)
      : new Date(j.contratacao!);

    const proxima = new Date(base);
    proxima.setMonth(proxima.getMonth() + periodoMeses);

    const diff = Math.ceil((proxima.getTime() - Date.now()) / 86400000);

    return diff;
  }

  // ============================================================
  // 🔥 AÇÕES
  // ============================================================
  irParaAvaliacao(j: JovemAprendiz) {
    this.router.navigate(['/avaliacao', j.matricula]);
  }

  enviarEmail(j: JovemAprendiz) {
    this.emailService.enviarEmail(j.matricula).subscribe({
      next: () => {
        alert('Email enviado com sucesso!');
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao enviar o email.');
      }
    });
  }

  editarRegistro(j: JovemAprendiz) {
    this.router.navigate(['/jovens/editar', j.matricula]);
  }

  excluir(matricula: string) {
    if (!confirm('Deseja excluir este jovem?')) return;

    this.jovemService.excluir(matricula).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(j => j.matricula !== matricula);
      },
      error: () => this.errorMessage = 'Erro ao excluir registro.'
    });
  }
}
