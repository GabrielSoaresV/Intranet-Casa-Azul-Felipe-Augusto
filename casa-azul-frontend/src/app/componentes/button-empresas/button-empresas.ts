import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button-empresas',
  standalone: false,
  templateUrl: './button-empresas.html',
  styleUrl: './button-empresas.css'
})
export class ButtonEmpresas {
  @Output() mostrarTabela = new EventEmitter<void>();

  clicouBotao() {
    this.mostrarTabela.emit();
  }
}
