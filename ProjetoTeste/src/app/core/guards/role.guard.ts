import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const allowedRoles = (route.data['roles'] as string[]) || [];
    const userRole = this.auth.getRole();

    // ✅ Log opcional (útil para debug)
    console.log(`🔐 RoleGuard → Rota: ${route.routeConfig?.path}`);
    console.log(`👤 Role do usuário: ${userRole || 'nenhuma'}`);
    console.log(`📜 Roles permitidas: ${allowedRoles.join(', ') || 'todas'}`);

    // 🔹 Se a rota não definir roles, deixa o AuthGuard decidir
    if (allowedRoles.length === 0) {
      return true;
    }

    // 🔹 Permite o acesso se a role do usuário estiver na lista
    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // 🚫 Caso contrário, redireciona
    alert('🚫 Acesso negado: você não tem permissão para acessar esta página.');

    // Se estiver autenticado, volta pra home
    if (this.auth.getToken()) {
      return this.router.createUrlTree(['/home']);
    }

    // Se não estiver autenticado, volta pro login
    return this.router.createUrlTree(['/login']);
  }
}
