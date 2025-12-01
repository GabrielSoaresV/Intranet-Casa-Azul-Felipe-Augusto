import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserService } from '../../service/user.service';
import { UserResponse } from '../../models/user-response.model';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {

  usuario: UserResponse | null = null;
  avatarUrl: string = '';
  menuOpen = false;
  currentRoute = '';

  constructor(
    public auth: AuthService,
    private router: Router,
    private userService: UserService
  ) {
    // Detectar rota atual
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => this.currentRoute = event.urlAfterRedirects);
  }

  ngOnInit(): void {

    // Se estiver no navegador, buscar usuário
    if (typeof window !== 'undefined') {
      this.userService.getCurrentUser().subscribe({
        next: user => {
          this.usuario = user;
          this.avatarUrl = this.getAvatarUrl(user);
        },
        error: () => {
          this.usuario = null;
        }
      });
    }
  }

  irPara(rota: string) {
    this.router.navigate([rota]);
    this.menuOpen = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.usuario = null;
      this.router.navigate(['/login']);
    });
  }

  /** Gera avatar baseado no profileImage vindo do backend */
  getAvatarUrl(user: UserResponse | null): string {
    if (!user) return '';

    if (user.profileImage) {

      // já URL completa
      if (user.profileImage.startsWith('http')) {
        return user.profileImage;
      }

      // caminho relativo do backend
      return `http://localhost:8080/${user.profileImage}`;
    }

    // fallback
    const name = encodeURIComponent(user.username || 'Usuário');
    return `https://ui-avatars.com/api/?name=${name}&background=667eea&color=fff&bold=true`;
  }
}
