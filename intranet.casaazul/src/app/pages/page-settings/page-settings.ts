import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-settings',
  standalone: false,
  templateUrl: './page-settings.html',
  styleUrl: './page-settings.css'
})
export class PageSettings {
  constructor(private router: Router) {}

  telaAtual: string = 'form'; // valor inicial

  irParaSettings() {
    this.router.navigate(['/settings']);
  }

  trocarTela(tela: string) {
    this.telaAtual = tela;
  }
}

