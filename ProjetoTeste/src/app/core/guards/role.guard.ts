import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const allowed = (route.data['roles'] as string[]) || [];
    const userRole = this.auth.getRole();

    // se a rota não definir roles, libera (fica a cargo do AuthGuard)
    if (!allowed.length) return true;

    if (userRole && allowed.includes(userRole)) return true;

    // redireciona se não tiver permissão
    return this.router.createUrlTree(['/login']); // ou ['/acesso-negado'] se preferir
  }
}
