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
  avatarUrl = '';

  constructor(private profileService: ProfileService, private router: Router) {}

  ngOnInit() {
    this.loadProfile();
  }

  /** 🔹 Carrega o perfil logado com o avatar */
  loadProfile() {
    this.profileService.getCurrentProfile().subscribe({
      next: profile => {
        this.profile = profile;
        this.avatarUrl = this.getAvatarUrl(profile);
        console.log('✅ Perfil carregado na navbar:', profile);
      },
      error: err => console.error('❌ Erro ao carregar perfil:', err)
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.profileService.logout();
    this.router.navigate(['/login']);
  }

  /** 🔹 Retorna o avatar real ou gera automaticamente */
  getAvatarUrl(profile: Profile | null): string {
    if (!profile) return '';

    // Se o backend enviou a imagem em Base64 (como byte[] convertido automaticamente)
    if (profile.avatar) {
      return `data:image/jpeg;base64,${profile.avatar}`;
    }

    // Fallback (gerador de avatar com nome)
    const name = encodeURIComponent(profile.name || 'Usuário');
    return `https://ui-avatars.com/api/?name=${name}&background=667eea&color=fff&bold=true`;
  }
}
