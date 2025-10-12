import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DemandaService } from '../../../services/demanda';
import { InterfaceDemanda } from '../../../models/demanda.model';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DemandaEditar } from '../../modals/demanda-editar/demanda-editar';

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
    console.log('ngOnInit chamado');
    this.carregarDemandas();
  }

  irParaCidadaosList() {
    this.componenteSelecionado.emit('cidadaos-list');
  }

  carregarDemandas(): void {
    this.carregando = true;

    this.demandaService.listar().subscribe({
      next: (res) => {
        console.log('Resposta do service listar:', res); // mostra o envelope completo
        this.demandas = res.data; // ⚠️ pega o array dentro de data
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

  // Método para formatar CPF
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
      return 'bg-primary'; // azul
    case 'não concluida':
      return 'bg-secondary'; // cinza escuro
    case 'em andamento':
      return 'bg-warning text-dark'; // amarelo
    case 'concluída':
      return 'bg-success'; // verde
    case 'cancelada':
      return 'bg-danger'; // vermelho
    default:
      return 'bg-secondary'; // padrão cinza
  }
}

visualizarDemanda() {
  console.log('Visualizar demanda:');
}


}
