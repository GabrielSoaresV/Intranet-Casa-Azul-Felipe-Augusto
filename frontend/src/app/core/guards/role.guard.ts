import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const allowedRoles = (route.data['roles'] as string[]) || [];
    const userRole = this.auth.getRole();

    if (allowedRoles.length === 0) {
      return true;
    }

    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    alert('🚫 Acesso negado: você não tem permissão para acessar esta página.');

    if (this.auth.getToken()) {
      return this.router.createUrlTree(['/home']);
    }

    return this.router.createUrlTree(['/login']);
  }
}
