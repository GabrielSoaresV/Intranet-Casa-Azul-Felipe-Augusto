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
  }

  enviarEmail(email: any) {
  }

  salvarServidor(servidor: any) {
  }

  salvarUsuario(usuario: any) {
  }

  salvarPreferencias(preferencias: any) {
  }

  salvarSeguranca(usuario: any) {
  }

}