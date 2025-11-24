import { Component } from '@angular/core';

@Component({
  selector: 'app-seguranca',
  standalone: false,
  templateUrl: './seguranca.html',
  styleUrl: './seguranca.css'
})
export class Seguranca {
  seguranca = { senhaMinima: 6, autenticacao2f: 'sim' };

  salvarSeguranca() {
    this.abrirModal('sucesso', 'Segurança salva', 'As configurações de segurança foram atualizadas com sucesso!');
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