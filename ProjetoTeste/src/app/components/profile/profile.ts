import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../core/services/profile.service';
import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class PageProfile implements OnInit {
  loading = true;
  profile: Profile | null = null;
  avatarUrl: string = '';

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    console.log('👤 PageProfile carregado');
    this.loadProfile();
  }

  /** 🔹 Busca o perfil real do usuário logado */
  loadProfile(): void {
    this.profileService.getCurrentProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.avatarUrl = this.getAvatarUrl(data);
        this.loading = false;
        console.log('✅ Perfil carregado:', this.profile);
      },
      error: (err) => {
        console.error('❌ Erro ao carregar perfil:', err);
        this.loading = false;
      }
    });
  }

  /** 🔹 Retorna o texto da função */
  getRoleText(role: string): string {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'ATTENDANT': return 'Atendente';
      case 'CITIZEN': return 'Cidadão';
      default: return 'Desconhecido';
    }
  }

  /** 🔹 Formata data */
formatDate(date?: string | Date): string {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}


  getAvatarUrl(profile: any): string {
  if (profile?.avatarUrl) {
    return profile.avatarUrl; // 🧠 Usa a imagem real salva no banco
  }

  // 🔸 Fallback automático (gera imagem com as iniciais)
  const name = encodeURIComponent(profile?.name || 'Usuário');
  return `https://ui-avatars.com/api/?name=${name}&background=667eea&color=fff&bold=true`;
}

}