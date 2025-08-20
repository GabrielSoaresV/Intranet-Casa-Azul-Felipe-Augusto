import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  currentRoute: string = '';

  constructor(private router: Router) {
    // Captura a rota atual sempre que ela mudar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects;
    });
  }

  irPara(pagina: string) {
    this.router.navigate([pagina]);
  }

  // Função para verificar se o link deve ser exibido
  mostrarLink(pagina: string): boolean {
    // Se a página atual for igual à página do link, retorna false
    if (pagina === '' && this.currentRoute === '/') return false; // logout, opcional
    return this.currentRoute !== `/${pagina}`;
  }
}
