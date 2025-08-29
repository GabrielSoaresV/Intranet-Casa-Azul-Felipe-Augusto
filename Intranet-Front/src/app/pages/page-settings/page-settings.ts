import { Component } from '@angular/core';

@Component({
  selector: 'app-page-settings',
  standalone: false,
  templateUrl: './page-settings.html',
  styleUrl: './page-settings.css'
})
export class PageSettings {

  secaoAtiva: string = 'email';

  selecionarSecao(secao: string) {
    this.secaoAtiva = secao;
    console.log('Seção ativa:', secao);
  }

  enviarEmail(email: any) {
    console.log('enviarEmail', email);
  }

  salvarServidor(servidor: any) {
    console.log('salvarServidor', servidor);
  }

  salvarUsuario(usuario: any) {
    console.log('salvarUsuario', usuario);
  }

  salvarPreferencias(preferencias: any) {
    console.log('salvarPreferencias', preferencias);
  }

  salvarSeguranca(usuario: any) {
    console.log('salvarSeguranca', usuario);
  }

}