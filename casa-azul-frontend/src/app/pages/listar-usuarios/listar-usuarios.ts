import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { UserDetailsResponse } from '../../models/user-details-response.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-usuarios',
  standalone: false,
  templateUrl: './listar-usuarios.html',
  styleUrl: './listar-usuarios.css'
})
export class ListarUsuarios implements OnInit {

  usuarios: UserDetailsResponse[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.usuarios = data,
      error: () => this.abrirModal('erro', 'Erro', 'Não foi possível carregar os usuários.')
    });
  }

  editar(u: UserDetailsResponse) {
    this.router.navigate(['/editar-usuario', u.username]);
  }

  gerenciarRoles(u: UserDetailsResponse) {
    this.router.navigate(['/gerenciar-roles', u.username]);
  }

  alternarStatus(u: UserDetailsResponse) {
    const acao = u.enabled ? 'desativar' : 'ativar';

    this.abrirModal(
      'confirmar',
      'Confirmar Ação',
      `Deseja realmente ${acao} o usuário ${u.username}?`,
      () => this.executarAlternancia(u)
    );
  }

  executarAlternancia(u: UserDetailsResponse) {
    const req = u.enabled
      ? this.userService.disableUser(u.id)
      : this.userService.enableUser(u.id);

    req.subscribe({
      next: () => {
        this.abrirModal('sucesso', 'Sucesso', 'Status atualizado com sucesso!');
        this.carregarUsuarios();
      },
      error: () => this.abrirModal('erro', 'Erro', 'Não foi possível alterar o status.')
    });
  }

  formatarCPF(cpf: string) {
    if (!cpf) return '';
    return (
      cpf.substring(0, 3) +
      '.' +
      cpf.substring(3, 6) +
      '.' +
      cpf.substring(6, 9) +
      '-' +
      cpf.substring(9)
    );
  }

  // ================== MODAL UNIVERSAL ==================
  modalAberto = false;
  modalTipo: 'sucesso' | 'erro' | 'confirmar' | 'info' = 'info';
  modalTitulo = '';
  modalMensagem = '';
  callbackConfirmacao: (() => void) | null = null;

  abrirModal(tipo: any, titulo: string, mensagem: string, callback?: () => void) {
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
