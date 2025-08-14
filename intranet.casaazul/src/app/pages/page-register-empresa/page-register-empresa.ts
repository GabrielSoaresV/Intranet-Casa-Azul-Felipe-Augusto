import { Component } from '@angular/core';

@Component({
  selector: 'app-page-register-empresa',
  standalone: false,
  templateUrl: './page-register-empresa.html',
  styleUrl: './page-register-empresa.css'
})
export class PageRegisterEmpresa {
  telaAtual: string = 'form'; // valor inicial

  trocarTela(tela: string) {
    this.telaAtual = tela;
  }
}
