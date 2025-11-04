import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../core/services/profile.service';
import { Profile } from '../../models/profile.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  profile: Profile | null = null;
  menuOpen = false;

  constructor(private profileService: ProfileService, private router: Router) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getCurrentProfile().subscribe({
      next: profile => (this.profile = profile),
      error: err => console.error('Erro ao carregar perfil:', err)
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.profileService.logout();
    this.router.navigate(['/login']);
  }

  /** 🔹 Retorna avatar real ou gera automaticamente */
  getAvatarUrl(profile: Profile | null): string {
    if (profile?.avatarUrl) {
      return profile.avatarUrl; // ✅ Usa imagem real salva no banco
    }

    const name = encodeURIComponent(profile?.name || 'Usuário');
    return `https://ui-avatars.com/api/?name=${name}&background=667eea&color=fff&bold=true`;
  }
}
