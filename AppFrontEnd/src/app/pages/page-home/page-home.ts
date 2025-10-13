import { Component } from '@angular/core';

@Component({
  selector: 'app-page-home',
  standalone: false,
  templateUrl: './page-home.html',
  styleUrl: './page-home.css'
})

export class PageHome {
  componenteAtivo: 'cidadaos-list' | 'cidadao-form' | 'demandas-list' | 'demanda-form' = 'demandas-list';

  onComponenteSelecionado(valor: 'cidadaos-list' | 'cidadao-form' | 'demandas-list' | 'demanda-form') {
    this.componenteAtivo = valor;
  }
}
