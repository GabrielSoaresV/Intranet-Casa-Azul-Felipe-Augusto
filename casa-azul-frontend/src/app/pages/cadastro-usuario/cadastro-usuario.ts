import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { RegisterRequest } from '../../models/register-request.model';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: false,
  templateUrl: './cadastro-usuario.html',
  styleUrl: './cadastro-usuario.css'
})
export class CadastroUsuario {

  loading = false;

  usuario: RegisterRequest = {
    username: '',
    email: '',
    cpf: '',
    password: ''
  };

  confirmarSenha = '';

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  // ========================
  // CADASTRAR COM CONFIRMAÇÃO
  // ========================
  cadastrarUsuario() {

    if (this.usuario.password !== this.confirmarSenha) {
      this.abrirModal('erro', 'Senhas Diferentes', 'A senha e a confirmação não coincidem.');
      return;
    }

    this.abrirModal(
      'confirmar',
      'Confirmar Cadastro',
      `Deseja realmente cadastrar o usuário "${this.usuario.username}"?`,
      () => this.enviarCadastro()
    );
  }

  enviarCadastro() {

    this.loading = true;

    this.authService.register(this.usuario).subscribe({
      next: () => {
        this.loading = false;

        this.abrirModal(
          'sucesso',
          'Cadastro Realizado',
          `Usuário ${this.usuario.username} cadastrado com sucesso!`,
          () => this.limparFormulario()
        );
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || 'Erro ao cadastrar usuário.';
        this.abrirModal('erro', 'Falha no Cadastro', msg);
      }
    });
  }

  limparFormulario() {
    this.usuario = {
      username: '',
      email: '',
      cpf: '',
      password: ''
    };
    this.confirmarSenha = '';
  }

  // ========================
  // FORMATAR CPF
  // ========================
  formatarCPF(event: any) {
    let valor = event.target.value.replace(/\D/g, '');

    if (valor.length > 11) {
      valor = valor.substring(0, 11);
    }

    if (valor.length > 9) {
      valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d)/, "$1.$2.$3-$4");
    } else if (valor.length > 6) {
      valor = valor.replace(/(\d{3})(\d{3})(\d)/, "$1.$2.$3");
    } else if (valor.length > 3) {
      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    }

    this.usuario.cpf = valor;
  }

  // ========================
  // MODAL UNIVERSAL
  // ========================
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
    this.cdr.detectChanges();
  }

  fecharModalGenerico() {
    this.modalAberto = false;

    if (this.callbackConfirmacao && this.modalTipo !== 'confirmar') {
      const fn = this.callbackConfirmacao;
      this.callbackConfirmacao = null;

      setTimeout(() => fn(), 50);
    }
  }

  executarConfirmacao() {
    if (this.callbackConfirmacao) {
      const fn = this.callbackConfirmacao;
      this.callbackConfirmacao = null;

      this.modalAberto = false;

      setTimeout(() => fn(), 50);
    }
  }
}
