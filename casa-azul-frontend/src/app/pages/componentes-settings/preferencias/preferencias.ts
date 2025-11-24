import { Component } from '@angular/core';

@Component({
  selector: 'app-preferencias',
  standalone: false,
  templateUrl: './preferencias.html',
  styleUrl: './preferencias.css'
})
export class Preferencias {
  preferencias = { idioma: 'pt', tema: 'claro' };

  salvarPreferencias() {
    this.abrirModal('sucesso', 'Preferências salvas', 'As preferências foram atualizadas com sucesso!');
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