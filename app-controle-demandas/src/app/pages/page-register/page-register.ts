import { Component } from '@angular/core';

@Component({
  selector: 'app-page-register',
  standalone: false,
  templateUrl: './page-register.html',
  styleUrl: './page-register.css'
})
export class PageRegister {
  componenteAtivo: 'cidadaos-form' | 'demandas-form' = 'demandas-form';

  onComponenteSelecionado(tipo: 'cidadaos-form' | 'demandas-form') {
    this.componenteAtivo = tipo;
  }
}
