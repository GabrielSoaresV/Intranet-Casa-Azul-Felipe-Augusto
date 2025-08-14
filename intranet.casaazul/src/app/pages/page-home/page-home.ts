import { Component } from '@angular/core';

@Component({
  selector: 'app-page-home',
  standalone: false,
  templateUrl: './page-home.html',
  styleUrl: './page-home.css'
})
export class PageHome {
  telaAtual: string = 'form'; // (não esquecer) essa aqui e a variavel inicial dentro do main container

  trocarTela(tela: string) {
    this.telaAtual = tela;
  }

  trocarParaForm() {
    this.trocarTela('form');
  }

  trocarParaForm2() {
    this.trocarTela('form2');
  }

}
