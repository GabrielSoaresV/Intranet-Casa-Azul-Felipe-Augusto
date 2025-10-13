import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DemandaService } from '../../../services/demanda';
import { InterfaceDemanda } from '../../../models/demanda.model';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DemandaEditar } from '../../modals/demanda-editar/demanda-editar';
import { DemandaSearchDTO } from '../../../dtos/dto-demandas/demanda-search.dto';

@Component({
  selector: 'app-demanda-list',
  standalone: false,
  templateUrl: './demanda-list.html',
  styleUrl: './demanda-list.css'
})
export class DemandaList implements OnInit {
  @Output() componenteSelecionado = new EventEmitter<'cidadaos-list' | 'demandas-list'>();

  demandas: InterfaceDemanda[] = [];
  carregando = true;
  filtrarDemanda: string = '';

  constructor(
    private demandaService: DemandaService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregarDemandas();
  }

  irParaCidadaosList() {
    this.componenteSelecionado.emit('cidadaos-list');
  }

  carregarDemandas(): void {
    this.carregando = true;

    this.demandaService.listar().subscribe({
      next: (res) => {
        this.demandas = res.data;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar demandas', err);
        this.carregando = false;
        this.cdr.detectChanges();
        Swal.fire('Erro', 'Ocorreu um erro ao carregar as demandas.', 'error');
      }
    });
  }

  editarDemanda(d: InterfaceDemanda) {
    const dialogRef = this.dialog.open(DemandaEditar, {
      width: '500px',
      data: d
    });

    dialogRef.afterClosed().subscribe((atualizado: InterfaceDemanda | null) => {
      if (atualizado) {
        this.carregarDemandas();
      }
    });
  }

  excluirDemanda(id: number) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente excluir esta demanda?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (!result.isConfirmed) return;

      this.demandaService.excluir(id).subscribe({
        next: () => {
          Swal.fire('Excluído!', 'Demanda excluída com sucesso.', 'success');
          setTimeout(() => {
            this.demandas = this.demandas.filter(d => d.id !== id);
          });
        },
        error: (err) => console.error(err)
      });
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


  formatarCPF(cpf: string): string {
    if (!cpf) return '';
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }

  statusTexto(status: string): string {
  switch (status.toLowerCase()) {
    case 'atender':
      return 'Em Andamento';
    case 'finalizar':
      return 'Concluida';
    case 'cancelar':
      return 'Cancelada';
    case 'devolver':
      return 'Não Concluida';
    case 'aberta':
      return 'Aberta';
    default:
      return status;
  }
}
statusClasse(status: string): string {
  switch (status.toLowerCase()) {
    case 'aberta':
      return 'bg-primary';
    case 'não concluida':
      return 'bg-secondary'; 
    case 'em andamento':
      return 'bg-warning text-dark';
    case 'concluída':
      return 'bg-success';
    case 'cancelada':
      return 'bg-danger'; 
    default:
      return 'bg-secondary'; 
  }
}

visualizarDemanda() {
}
}
