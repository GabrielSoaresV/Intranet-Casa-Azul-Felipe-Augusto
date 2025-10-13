import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { CidadaoService } from '../../../services/cidadao';
import { InterfaceCidadao } from '../../../models/cidadao.model';
import { MatDialog } from '@angular/material/dialog';
import { CidadaoEditar } from '../../modals/cidadao-editar/cidadao-editar';
import { ListarDemandasCidadao } from '../../modals/listar-demandas-cidadao/listar-demandas-cidadao';
import { CidadaoUpdateDTO } from '../../../dtos/dto-cidadaos/cidadao-update.dto';

@Component({
  selector: 'app-cidadao-list',
  standalone: false,
  templateUrl: './cidadao-list.html',
  styleUrls: ['./cidadao-list.css']
})
export class CidadaoList implements OnInit {
  @Output() componenteSelecionado = new EventEmitter<'cidadaos-list' | 'demandas-list'>();

  filtro: string = '';
  cidadaos: InterfaceCidadao[] = [];
  carregando = true;

  constructor(
    private cidadaoService: CidadaoService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.carregarCidadaos();
  }

  irParaDemandasList() {
    this.componenteSelecionado.emit('demandas-list');
  }

  private tratarErro(mensagem: string, erro?: any) {
    console.error(mensagem, erro);
    Swal.fire('Erro', mensagem, 'error');
    this.carregando = false;
    this.cdr.detectChanges();
  }

  carregarCidadaos(): void {
    this.carregando = true;
    this.cidadaoService.listar().subscribe({
      next: (res: any) => {
        this.cidadaos = res.data;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.tratarErro('Ocorreu um erro ao carregar os cidadãos.', err);
      }
    });
  }

  editarCidadao(c: InterfaceCidadao) {
    const dialogRef = this.dialog.open(CidadaoEditar, { width: '500px', data: c });
    dialogRef.afterClosed().subscribe((atualizado: CidadaoUpdateDTO | null) => {
      if (!atualizado) return;

      this.cidadaoService.atualizar(c.cpf, atualizado).subscribe({
        next: () => {
          Swal.fire('Sucesso', 'Cidadão atualizado com sucesso.', 'success');
          this.carregarCidadaos();
        },
        error: (err) => this.tratarErro('Ocorreu um erro ao atualizar o cidadão.', err)
      });
    });
  }

  excluirCidadao(cpf: string) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente excluir este cidadão?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (!result.isConfirmed) return;

      this.cidadaoService.excluir(cpf).subscribe({
        next: () => {
          Swal.fire('Excluído!', 'Cidadão excluído com sucesso.', 'success');
          this.cidadaos = this.cidadaos.filter(c => c.cpf !== cpf);
        },
        error: (err) => this.tratarErro('Ocorreu um erro ao excluir o cidadão.', err)
      });
    });
  }

  verDemandas(c: InterfaceCidadao) {
    this.dialog.open(ListarDemandasCidadao, { data: c, panelClass: 'custom-modal' });
  }

  formatarCPF(cpf: string): string {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }

  get cidadaosFiltrados(): InterfaceCidadao[] {
    if (!this.filtro) return this.cidadaos;

    const filtroLower = this.filtro.toLowerCase();
    return this.cidadaos.filter(c =>
      c.cpf.replace(/\D/g, '').includes(this.filtro.replace(/\D/g, '')) ||
      c.nome.toLowerCase().includes(filtroLower) ||
      c.email.toLowerCase().includes(filtroLower)
    );
  }
}
