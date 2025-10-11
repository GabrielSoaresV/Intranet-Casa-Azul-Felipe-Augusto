import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { CidadaoService } from '../../services/cidadao';
import { CidadaoModel } from '../../models/cidadao.model';
import { MatDialog } from '@angular/material/dialog';
import { CidadaoEditar } from '../modals/cidadao-editar/cidadao-editar';
import { ListarDemandasCidadao } from '../modals/listar-demandas-cidadao/listar-demandas-cidadao';

@Component({
  selector: 'app-cidadao-lista',
  templateUrl: './cidadao-lista.html',
  styleUrls: ['./cidadao-lista.css'],
  standalone: false
})
export class CidadaoLista implements OnInit {
  @Output() componenteSelecionado = new EventEmitter<'cidadaos' | 'demandas'>(); 

  filtrarCidadao: string = '';
  cidadaos: CidadaoModel[] = [];
  carregando = true;

  constructor(
    private cidadaoService: CidadaoService,
    private cdr: ChangeDetectorRef, 
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.carregarCidadaos();
  }

  irParaDemandas() {
    this.componenteSelecionado.emit('demandas');
  }

  carregarCidadaos(): void {
    this.carregando = true;

    this.cidadaoService.listar().subscribe({
      next: (response) => {
        this.cidadaos = response.data;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar cidadãos', err);
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  editarCidadao(c: CidadaoModel) {
    const dialogRef = this.dialog.open(CidadaoEditar, {
      width: '500px',
      data: c
    });

    dialogRef.afterClosed().subscribe((atualizado: boolean) => {
      if (atualizado) {
        this.carregarCidadaos();
      }
    });
  }

  excluirCidadao(cpf: string) {
    if (confirm('Tem certeza que deseja excluir este cidadão?')) {
      this.cidadaoService.excluir(cpf).subscribe({
        next: () => {
          alert('🗑️ Cidadão excluído com sucesso!');
          this.cidadaos = this.cidadaos.filter(c => c.cpf !== cpf);
        },
        error: (err) => {
          console.error('Erro ao excluir cidadão:', err);
          alert('❌ Ocorreu um erro ao excluir o cidadão.');
        }
      });
    }
  }

  verDemandas(c: CidadaoModel) {
    this.dialog.open(ListarDemandasCidadao, {
      data: c,
      panelClass: 'custom-modal'
    });
  }
      
  formatarCPF(cpf: string): string {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }
}
