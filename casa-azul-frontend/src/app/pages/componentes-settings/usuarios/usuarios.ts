import { Component } from '@angular/core';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios {
  usuario = { nome: '', email: '', perfil: 'user' };

  salvarUsuario() {
    this.abrirModal('sucesso', 'Usuário salvo', 'Os dados do usuário foram atualizados com sucesso!');
  }
  // ------------ MODAL UNIVERSAL ------------
modalAberto = false;
modalTipo: 'sucesso' | 'erro' | 'confirmar' | 'info' = 'info';
modalTitulo = '';
modalMensagem = '';
callbackConfirmacao: (() => void) | null = null;

// Abrir modal genérico
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

// Fechar modal
fecharModalGenerico() {
  this.modalAberto = false;
}

// Executar ação de confirmação
executarConfirmacao() {
  if (this.callbackConfirmacao) this.callbackConfirmacao();
  this.fecharModalGenerico();
}

}