import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  currentRoute: string = '';
  isDarkMode = false;

  toggleTheme() {
  this.isDarkMode = !this.isDarkMode;

  if (this.isDarkMode) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
}
  constructor(private router: Router) {
    // Atualiza rota sempre que mudar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects;
    });
  }

  ngOnInit(): void {
    // Captura a rota no carregamento inicial (mesmo após F5)
    this.currentRoute = this.router.url;
  }

  irPara(pagina: string) {
    this.router.navigate([pagina]);
  }

  mostrarLink(pagina: string): boolean {
    // Se estiver na rota alvo, não mostra o link
    if (pagina === '' && this.currentRoute === '/') return false; // logout
    return this.currentRoute !== `/${pagina}`;
  }
}
