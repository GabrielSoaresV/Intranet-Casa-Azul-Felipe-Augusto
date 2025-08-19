import { Component } from '@angular/core';

@Component({
  selector: 'app-page-gestao',
  standalone: false,
  templateUrl: './page-gestao.html',
  styleUrl: './page-gestao.css'
})
export class PageGestao {
  tabelaAtiva: 'jovens' | 'empresas' = 'jovens'; // valor inicial

  mostrarTabelaEmpresas() {
    this.tabelaAtiva = 'empresas';
  }

  mostrarTabelaJovens() {
    this.tabelaAtiva = 'jovens';
  }

  alternarTabela() {
    this.tabelaAtiva = this.tabelaAtiva === 'jovens' ? 'empresas' : 'jovens';
  }
}
