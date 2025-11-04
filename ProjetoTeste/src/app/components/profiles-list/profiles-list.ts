import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../core/services/profile.service';
import { DemandService } from '../../core/services/demand.service';
import { Profile } from '../../models/profile.model';
import { Demand } from '../../models/demand.model';

@Component({
  selector: 'app-profiles-list',
  standalone: false,
  templateUrl: './profiles-list.html',
  styleUrl: './profiles-list.css'
})
export class ProfilesList implements OnInit {
  loading = true;
  profiles: Profile[] = [];
  showModal = false;
  selectedProfile: Profile | null = null;

  // 🔹 Demandas vinculadas ao perfil selecionado
  loadingDemands = false;
  demands: Demand[] = [];

  constructor(
    private profileService: ProfileService,
    private demandService: DemandService
  ) {}

  ngOnInit(): void {
    console.log('👥 ProfilesList carregado');
    this.loadProfiles();
  }

searchTerm = ''; // termo da busca
filteredProfiles: Profile[] = []; // lista filtrada

/** 🔹 Após carregar todos os perfis */
loadProfiles(): void {
  this.loading = true;
  this.profileService.getAll().subscribe({
    next: (data) => {
      this.profiles = data;
      this.filteredProfiles = data; // copia inicial
      this.loading = false;
    },
    error: (err) => {
      this.loading = false;
      console.error('❌ Erro ao carregar perfis:', err);
    }
  });
}

/** 🔍 Filtra por nome ou CPF */
searchProfiles(): void {
  const term = this.searchTerm.trim().toLowerCase();

  if (!term) {
    this.filteredProfiles = [...this.profiles];
    return;
  }

  this.filteredProfiles = this.profiles.filter(p =>
    (p.name && p.name.toLowerCase().includes(term)) ||
    (p.cpf && p.cpf.toLowerCase().includes(term))
  );
}

/** 🔄 Limpa a busca */
clearSearch(): void {
  this.searchTerm = '';
  this.filteredProfiles = [...this.profiles];
}

  /** 🔹 Abre modal com os detalhes e carrega as demandas */
  viewProfile(profile: Profile): void {
    console.log('👤 Visualizando perfil:', profile);
    this.selectedProfile = profile;
    this.showModal = true;
    this.loadDemandsForProfile(profile.cpf);
  }

  /** 🔹 Fecha o modal */
  closeModal(): void {
    console.log('❌ Fechando modal');
    this.showModal = false;
    this.selectedProfile = null;
    this.demands = [];
  }

  /** 🔹 Carrega as demandas vinculadas ao perfil */
  loadDemandsForProfile(cpf: string): void {
    this.loadingDemands = true;
    this.demands = [];

    this.demandService.getDemandsByCreator(cpf).subscribe({
      next: (data) => {
        this.demands = data;
        this.loadingDemands = false;
        console.log(`📦 Demandas de ${cpf}:`, data);
      },
      error: (err) => {
        this.loadingDemands = false;
        console.error('❌ Erro ao carregar demandas do perfil:', err);
      }
    });
  }

  /** 🔹 Retorna imagem real ou gera avatar automático */
  getAvatarUrl(profile: Profile | null): string {
    if (profile?.avatarUrl) {
      return profile.avatarUrl;
    }

    const name = encodeURIComponent(profile?.name || 'Usuário');
    return `https://ui-avatars.com/api/?name=${name}&background=667eea&color=fff&bold=true`;
  }

  /** 🔹 Formata data */
  formatDate(date?: string | Date): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
