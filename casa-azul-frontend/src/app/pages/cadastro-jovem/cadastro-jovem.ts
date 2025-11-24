import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../service/empresa';
import { JovemService } from '../../service/jovem';
import { InterfaceEmpresa } from '../../models/interface-empresa.model';
import { InterfaceJovem } from '../../models/interface-jovem.model';

@Component({
  selector: 'app-cadastro-jovem',
  standalone: false,
  templateUrl: './cadastro-jovem.html',
  styleUrl: './cadastro-jovem.css'
})
export class CadastroJovem {

  formSelecionado: string = 'jovem';

  jovem: InterfaceJovem = {
    nome: '',
    matricula: '',
    contratacao: '',
    rescisao: '',
    periodoAvaliacao: '3',
    empresa: undefined,
    email: '',
    telefone: '',
    observacoes: '',
    nomeresponsavel: '',
    telefoneresponsavel: ''
  };

  empresas: InterfaceEmpresa[] = [];

  constructor(
    private empresaService: EmpresaService,
    private jovemService: JovemService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarEmpresas();
  }

  carregarEmpresas() {
    this.empresaService.listar().subscribe({
      next: (data) => {
        this.empresas = data;
      },
      error: () => {
        this.abrirModal('erro', 'Erro ao Carregar Empresas', 'Não foi possível carregar a lista de empresas.');
      }
    });
  }

  selecionarFormulario(tipo: string) {
    this.formSelecionado = tipo;
  }

  // -------- CADASTRAR COM CONFIRMAÇÃO ---------

  cadastrarJovem() {

    if (!this.jovem.empresa) {
      this.abrirModal('erro', 'Empresa Não Selecionada', 'Selecione uma empresa antes de cadastrar.');
      return;
    }

    // 🔥 Primeiro: pergunta se quer confirmar o cadastro
    this.abrirModal(
      'confirmar',
      'Confirmar Cadastro',
      'Deseja realmente cadastrar este jovem?',
      () => this.enviarCadastro() // executa somente ao clicar CONFIRMAR
    );
  }

  enviarCadastro() {

    this.jovemService.cadastrar(this.jovem).subscribe({
      next: (res) => {

        const nome = res?.nome || this.jovem.nome;

        // 🔥 Após salvar → mostra modal de sucesso
        this.abrirModal(
          'sucesso',
          'Cadastro Realizado',
          `O jovem ${nome} foi cadastrado com sucesso!`,
          () => this.limparFormulario() // executa ao fechar modal
        );
      },

      error: (err) => {
        this.abrirModal('erro', 'Erro no Cadastro', err.error || 'Não foi possível cadastrar o jovem.');
      }
    });
  }

  limparFormulario() {
    this.jovem = {
      nome: '',
      matricula: '',
      contratacao: '',
      rescisao: '',
      periodoAvaliacao: '3',
      empresa: undefined,
      email: '',
      telefone: '',
      observacoes: '',
      nomeresponsavel: '',
      telefoneresponsavel: ''
    };
  }

  // ---------------- FORMATAÇÃO ----------------

  formatarTelefone(event: any, tipo: 'jovem' | 'responsavel') {
    let valor = event.target.value.replace(/\D/g, '');

    if (valor.length > 11) valor = valor.substring(0, 11);

    if (valor.length > 6) {
      valor = `(${valor.substring(0, 2)}) ${valor.substring(2, 7)}-${valor.substring(7)}`;
    } else if (valor.length > 2) {
      valor = `(${valor.substring(0, 2)}) ${valor.substring(2)}`;
    } else if (valor.length > 0) {
      valor = `(${valor}`;
    }

    if (tipo === 'jovem') this.jovem.telefone = valor;
    else this.jovem.telefoneresponsavel = valor;
  }

  // ---------------- MODAL UNIVERSAL ----------------

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

    // 🔥 Força Angular a atualizar a tela AGORA
    this.cdr.detectChanges();
  }


  fecharModalGenerico() {
    this.modalAberto = false;

    // Se NÃO é modal de confirmação e existe callback → executar DEPOIS de fechar
    if (this.callbackConfirmacao && this.modalTipo !== 'confirmar') {
      const fn = this.callbackConfirmacao;
      this.callbackConfirmacao = null;

      // Execução assíncrona garante renderização
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

      // Fechar modal antes…
      this.modalAberto = false;

      // …e esperar Angular atualizar a interface
      setTimeout(() => {
        fn();
        this.cdr.detectChanges();
      });
      return;
    }

    this.fecharModalGenerico();
  }

}