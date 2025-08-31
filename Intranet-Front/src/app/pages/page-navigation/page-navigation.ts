import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-navigation',
  standalone: false,
  templateUrl: './page-navigation.html',
  styleUrl: './page-navigation.css'
})

export class PageNavigation {
  constructor(private router: Router) {}

  irPara(pagina: string) {
    this.router.navigate([pagina]);
  }
  
  confirmar() {
    alert('⚠️ Esta função ainda está em desenvolvimento 😢');
  }
}
