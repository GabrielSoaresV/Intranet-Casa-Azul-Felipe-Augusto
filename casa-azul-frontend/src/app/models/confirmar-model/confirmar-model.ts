import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmar-model',
  standalone: false,
  templateUrl: './confirmar-model.html',
  styleUrl: './confirmar-model.css'
})
export class ConfirmarModel {

  @Input() aberto = false;
  @Input() tipo: 'sucesso' | 'erro' | 'info' | 'confirmar' = 'info';
  @Input() titulo: string = '';
  @Input() mensagem: string = '';
  @Input() textoConfirmar: string = 'Confirmar';
  @Input() textoFechar: string = 'Fechar';

  @Output() fechar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<void>();

  onFechar() {
    this.fechar.emit();
  }

  onConfirmar() {
    this.confirmar.emit();
  }
}