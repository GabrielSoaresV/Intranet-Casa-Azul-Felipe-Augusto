import { Component } from '@angular/core';
import { BuscaService } from '../../service/busca.service';

@Component({
  selector: 'app-search-bar',
  standalone: false,
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar {
  textoDigitado: string = '';

  constructor(private buscaService: BuscaService) {}

  onEnter() {
    this.buscaService.emitirTexto(this.textoDigitado);
  }
}
