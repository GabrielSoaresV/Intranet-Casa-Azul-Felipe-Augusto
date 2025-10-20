import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken'); // verifica se existe token
    if (token) {
      return true; // permite acesso
    } else {
      console.log('Usuário não logado, redirecionando...');
      this.router.navigate(['/login']);
      return false; // bloqueia acesso
    }
  }
}
