import { Component } from '@angular/core';
import { BuscaService } from '../../services/busca.service';

@Component({
  selector: 'app-search-bar',
  standalone: false,
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css']
})
export class SearchBar {
  textoDigitado: string = '';

  constructor(private buscaService: BuscaService) {}

  onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Enter') {
      this.buscaService.emitirTexto(input.value);
    }
  }
}

