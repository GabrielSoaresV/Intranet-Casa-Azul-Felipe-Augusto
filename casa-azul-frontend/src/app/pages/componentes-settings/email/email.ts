import { Component } from '@angular/core';

@Component({
  selector: 'app-email',
  standalone: false,
  templateUrl: './email.html',
  styleUrl: './email.css'
})
export class Email {
  email = { remetente: '', senha: '', assuntoPadrao: '', corpoPadrao: '' };

  salvarEmail() {
    this.abrirModal(
      'sucesso',
      'Configurações Salvas',
      'As configurações de email foram atualizadas com sucesso!'
    );
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