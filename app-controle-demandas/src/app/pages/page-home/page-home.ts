import { Component } from '@angular/core';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.html',
  styleUrls: ['./page-home.css'],
  standalone: false
})
export class PageHome {
  componenteAtivo: 'cidadaos' | 'demandas' = 'demandas';

  onComponenteSelecionado(tipo: 'cidadaos' | 'demandas') {
    this.componenteAtivo = tipo;
  }
}
