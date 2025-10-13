import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  @Output() componenteSelecionado = new EventEmitter<'cidadaos-list' | 'cidadao-form' | 'demandas-list' | 'demanda-form'>();

  selecionarComponente(componente: 'cidadaos-list' | 'cidadao-form' | 'demandas-list' | 'demanda-form') {
    this.componenteSelecionado.emit(componente);
  }
}