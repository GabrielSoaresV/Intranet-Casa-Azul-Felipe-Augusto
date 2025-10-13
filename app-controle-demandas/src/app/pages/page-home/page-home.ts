import { Component } from '@angular/core';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.html',
  styleUrls: ['./page-home.css'],
  standalone: false
})
export class PageHome {
  componenteAtivo: 'demandas-list' | 'cidadaos-list' = 'demandas-list';

  onComponenteSelecionado(valor: 'demandas-list' | 'cidadaos-list') {
    this.componenteAtivo = valor;
  }
}
