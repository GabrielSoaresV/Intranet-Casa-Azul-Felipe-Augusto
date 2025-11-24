import { ChangeDetectorRef, Component } from '@angular/core';
import { EmpresaService } from '../../service/empresa';
import { InterfaceEmpresa } from '../../models/interface-empresa.model';

@Component({
  selector: 'app-cadastro-empresa',
  standalone: false,
  templateUrl: './cadastro-empresa.html',
  styleUrl: './cadastro-empresa.css'
})
export class CadastroEmpresa {

  formSelecionado: string = 'empresa';

  empresa: InterfaceEmpresa = {
    cnpj: '',
    nomeEmpresa: '',
    emailEmpresa: '',
    telefoneEmpresa: '',
    rhNomeResponsavel: '',
    rhEmailResponsavel: ''
  };

  constructor(
    private empresaService: EmpresaService,
    private cdr: ChangeDetectorRef
  ) {}

  // ---------- CADASTRAR COM CONFIRMAÇÃO ----------
  cadastrarEmpresa() {

    if (!this.empresa.cnpj) {
      this.abrirModal('erro', 'Campo Obrigatório', 'O CNPJ deve ser informado.');
      return;
    }

    // Primeiro: pergunta se quer confirmar
    this.abrirModal(
      'confirmar',
      'Confirmar Cadastro',
      'Deseja realmente cadastrar esta empresa?',
      () => this.enviarCadastro()
    );
  }

  enviarCadastro() {

    this.empresaService.cadastrar(this.empresa).subscribe({
      next: (res: InterfaceEmpresa) => {

        const nome = res?.nomeEmpresa || this.empresa.nomeEmpresa;

        // Após salvar → modal de sucesso
        this.abrirModal(
          'sucesso',
          'Cadastro Realizado',
          `A empresa ${nome} foi cadastrada com sucesso!`,
          () => this.limparFormulario()
        );
      },

      error: (err) => {
        this.abrirModal(
          'erro',
          'Erro no Cadastro',
          err.error || 'Não foi possível cadastrar a empresa.'
        );
      }
    });
  }

  limparFormulario() {
    this.empresa = {
      cnpj: '',
      nomeEmpresa: '',
      emailEmpresa: '',
      telefoneEmpresa: '',
      rhNomeResponsavel: '',
      rhEmailResponsavel: ''
    };
  }

  // ------------ FORMATAÇÃO TELEFONE ------------
  formatarTelefone(event: any) {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 11) input = input.slice(0, 11);

    let formatted = '';
    if (input.length > 10) {
      formatted = `(${input.slice(0, 2)}) ${input.slice(2, 7)}-${input.slice(7)}`;
    } else if (input.length > 6) {
      formatted = `(${input.slice(0, 2)}) ${input.slice(2, 6)}-${input.slice(6)}`;
    } else if (input.length > 2) {
      formatted = `(${input.slice(0, 2)}) ${input.slice(2)}`;
    } else {
      formatted = input;
    }

    this.empresa.telefoneEmpresa = formatted;
  }

  // ------------ MODAL UNIVERSAL ------------

  modalAberto = false;
  modalTipo: 'sucesso' | 'erro' | 'confirmar' | 'info' = 'info';
  modalTitulo = '';
  modalMensagem = '';
  callbackConfirmacao: (() => void) | null = null;

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

    // força renderização do modal
    this.cdr.detectChanges();
  }

  fecharModalGenerico() {
    this.modalAberto = false;

    // Se NÃO for modal de confirmação → executa callback depois de fechar
    if (this.callbackConfirmacao && this.modalTipo !== 'confirmar') {
      const fn = this.callbackConfirmacao;
      this.callbackConfirmacao = null;

      setTimeout(() => {
        fn();
        this.cdr.detectChanges();
      });
    }
  }

  executarConfirmacao() {
    if (this.callbackConfirmacao) {

      const fn = this.callbackConfirmacao;
      this.callbackConfirmacao = null;

      this.modalAberto = false;

      // executa callback depois que Angular fecha o modal
      setTimeout(() => {
        fn();
        this.cdr.detectChanges();
      });

      return;
    }

    this.fecharModalGenerico();
  }

}
