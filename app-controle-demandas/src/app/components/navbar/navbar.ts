import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  standalone: false
})
export class Navbar {
  @Output() componenteSelecionado = new EventEmitter<'page-home' | 'page-register'>();

  selecionar(tipo: 'page-home' | 'page-register', event: Event) {
    event.preventDefault();
    this.componenteSelecionado.emit(tipo);
  }
}
