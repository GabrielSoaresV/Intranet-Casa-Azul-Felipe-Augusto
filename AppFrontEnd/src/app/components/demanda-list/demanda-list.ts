import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DemandaService } from '../../services/demanda';
import { DemandaSearchDTO } from '../../dtos/dto-demandas/demanda-search.dto';
import { DemandaStatusDTO } from '../../dtos/dto-demandas/demanda-status.dto';

@Component({
  selector: 'app-demanda-list',
  standalone: false,
  templateUrl: './demanda-list.html',
  styleUrls: ['./demanda-list.css']
})
export class DemandaList implements OnInit {
  @Output() componenteSelecionado = new EventEmitter<'cidadaos-list' | 'cidadao-form' | 'demandas-list' | 'demanda-form'>();

  demandas: DemandaSearchDTO[] = [];
  carregando = false;

  constructor(private demandaService: DemandaService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.carregarDemandas();
  }

  carregarDemandas(): void {
    this.carregando = true;
    this.demandaService.listar().subscribe({
      next: (res: any) => {
        this.demandas = res.data || res;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar demandas:', err);
        this.carregando = false;
      }
    });
  }

  navegarPara(componente: 'cidadaos-list' | 'cidadao-form' | 'demandas-list' | 'demanda-form') {
    this.componenteSelecionado.emit(componente);
  }

  excluir(demanda: DemandaSearchDTO) {
    const confirmacao = confirm(`Deseja realmente excluir a demanda "${demanda.titulo}"?`);
    if (!confirmacao) return;

    if (demanda.status !== 'Concluída' && demanda.status !== 'Cancelada') {
      console.error('Só é possível excluir demandas Concluídas ou Canceladas.');
      return;
    }

    this.demandas = this.demandas.filter(d => d.id !== demanda.id);
    this.cdr.detectChanges();
    this.demandaService.excluir(demanda.id).subscribe({
      next: () => {},
      error: (err) => {
        console.error('Erro ao excluir demanda:', err);
        this.carregarDemandas();
      }
    });
  }

  alterarStatus(demanda: DemandaSearchDTO, acao: 'atender' | 'finalizar' | 'cancelar' | 'devolver') {
    switch (acao) {
      case 'atender':
        demanda.status = 'Em Andamento';
        break;
      case 'finalizar':
        demanda.status = 'Concluída';
        break;
      case 'cancelar':
        demanda.status = 'Cancelada';
        break;
      case 'devolver':
        demanda.status = 'Não Concluída';
        break;
    }

    this.demandaService.alterarStatus(demanda.id, { status: acao }).subscribe({
      next: () => {},
      error: (err) => {
        if (err.status === 403) {
          console.error(err.error?.message || 'Ação não permitida para esta demanda.');
          this.carregarDemandas();
        } else {
          console.error('Erro ao alterar status:', err);
          this.carregarDemandas();
        }
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Aberta':
        return 'blue';
      case 'Não Concluída':
        return 'orange';
      case 'Em Andamento':
        return 'blue';
      case 'Concluída':
        return 'green';
      case 'Cancelada':
        return 'red';
      default:
        return 'gray';
    }
  }
  displayedColumns: string[] = ['id', 'titulo', 'descricao', 'status', 'acoes'];

}
