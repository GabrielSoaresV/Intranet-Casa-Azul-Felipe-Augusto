import { Component } from '@angular/core';

@Component({
  selector: 'app-servidor',
  standalone: false,
  templateUrl: './servidor.html',
  styleUrl: './servidor.css'
})
export class Servidor {
  servidor = { ip: '', porta: 3306 };

  salvarServidor() {
    this.abrirModal('sucesso', 'Servidor salvo', 'As configurações do servidor foram atualizadas com sucesso!');
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