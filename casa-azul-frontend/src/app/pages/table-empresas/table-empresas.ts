import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { InterfaceEmpresa } from '../../models/interface-empresa.model';
import { EmpresaService } from '../../service/empresa';
import { BuscaService } from '../../service/busca.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table-empresas',
  standalone: false,
  templateUrl: './table-empresas.html',
  styleUrl: './table-empresas.css'
})
export class TableEmpresa implements OnInit {
  empresas: InterfaceEmpresa[] = [];
  todasEmpresas: InterfaceEmpresa[] = [];
  registroExpandido: number | null = null;
  registroEditando: InterfaceEmpresa | null = null;
  private buscaSubscription!: Subscription;

  // ------------ MODAL UNIVERSAL ------------
  modalAberto = false;
  modalTipo: 'sucesso' | 'erro' | 'confirmar' | 'info' = 'info';
  modalTitulo = '';
  modalMensagem = '';
  callbackConfirmacao: (() => void) | null = null;

  constructor(
    private empresaService: EmpresaService,
    private buscaService: BuscaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarDados();

    this.buscaSubscription = this.buscaService.textoBusca$.subscribe((texto) => {
      this.aplicarFiltro(texto);
    });
  }

  carregarDados(): void {
    this.empresaService.listar().subscribe({
      next: (dados) => {
        this.todasEmpresas = dados;
        this.empresas = dados;
        this.cdr.detectChanges();
      },
      error: () => {
        this.abrirModal('erro', 'Erro ao Carregar', 'Não foi possível carregar as empresas.');
      }
    });
  }

  aplicarFiltro(texto: string): void {
    if (!texto) {
      this.empresas = [...this.todasEmpresas];
    } else {
      const busca = texto.toLowerCase();
      this.empresas = this.todasEmpresas.filter(emp =>
        emp.nomeEmpresa?.toLowerCase().includes(busca) ||
        emp.cnpj?.toLowerCase().includes(busca)
      );
    }
    this.cdr.detectChanges();
  }

  toggleDetalhes(index: number) {
    this.registroExpandido = this.registroExpandido === index ? null : index;
  }

  confirmar(empresa: InterfaceEmpresa) {
  }

  editarRegistro(empresa: InterfaceEmpresa) {
    this.registroEditando = { ...empresa };
  }

  carregarRegistros(): void {
    this.carregarDados();
  }

  salvarEdicao() {
    if (!this.registroEditando) return;

    this.empresaService.atualizar(this.registroEditando.cnpj, this.registroEditando).subscribe({
      next: () => {
        this.abrirModal('sucesso', 'Alterações Salvas', 'Os dados foram atualizados.');
        this.fecharModal();
        this.carregarRegistros();
      },
      error: () => {
        this.abrirModal('erro', 'Erro ao Salvar', 'Não foi possível atualizar a empresa.');
      }
    });
  }

  fecharModal() {
    this.registroEditando = null;
  }

  excluir(cnpj: string): void {
    this.abrirModal(
      'confirmar',
      'Excluir Empresa',
      `Deseja realmente excluir a empresa de CNPJ ${cnpj}?`,
      () => this.excluirConfirmado(cnpj)
    );
  }

  excluirConfirmado(cnpj: string) {
    this.empresaService.excluir(cnpj).subscribe({
      next: () => {
        this.empresas = this.empresas.filter(e => e.cnpj !== cnpj);
        this.todasEmpresas = this.todasEmpresas.filter(e => e.cnpj !== cnpj);

        this.cdr.detectChanges();

        setTimeout(() => {
          this.abrirModal('sucesso', 'Excluído', 'A empresa foi removida.');
          this.carregarDados(); // recarregar dados depois de excluir
        });
      },
      error: () => {
        setTimeout(() => {
          this.abrirModal('erro', 'Erro ao Excluir', 'Não foi possível remover a empresa.');
        });
      }
    });
  }

  // FORMATAR CNPJ
  formatarCnpj(cnpj: string): string {
    if (!cnpj) return '';
    let v = cnpj.replace(/\D/g, '');
    v = v.replace(/^(\d{2})(\d)/, '$1.$2');
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
    v = v.replace(/(\d{4})(\d)/, '$1-$2');
    return v;
  }

  // TRACKBY
  trackByCnpj(index: number, item: InterfaceEmpresa) {
    return item.cnpj;
  }

  // ------------ MÉTODOS DO MODAL UNIVERSAL ------------
  abrirModal(
    tipo: 'sucesso' | 'erro' | 'confirmar' | 'info',
    titulo: string,
    mensagem: string,
    callback?: () => void
  ) {
    this.modalTipo = tipo;
    this.modalTitulo = titulo;
    this.modalMensagem = mensagem;
    this.modalAberto = true;
    this.callbackConfirmacao = callback || null;
  }

  fecharModalGenerico() {
    this.modalAberto = false;
    this.callbackConfirmacao = null; // Cancela a ação
  }

  executarConfirmacao() {
    if (this.callbackConfirmacao) {
      this.callbackConfirmacao();  // só executa ao confirmar
    }
  }
}
