import { Component } from '@angular/core';

@Component({
  selector: 'app-seguranca',
  standalone: false,
  templateUrl: './seguranca.html',
  styleUrl: './seguranca.css'
})
export class Seguranca {
  seguranca = { senhaMinima: 6, autenticacao2f: 'sim' };

  salvarSeguranca() {
    console.log('Configuração de segurança salva', this.seguranca);
  }
}