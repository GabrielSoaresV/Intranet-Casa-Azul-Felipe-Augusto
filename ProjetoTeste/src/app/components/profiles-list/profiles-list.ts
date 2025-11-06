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
  filteredProfiles: Profile[] = [];
  searchTerm = '';

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

  /** 🔹 Carrega todos os perfis */
  loadProfiles(): void {
    this.loading = true;
    this.profileService.getAll().subscribe({
      next: (data) => {
        this.profiles = data;
        this.filteredProfiles = data;
        this.loading = false;
        console.log('✅ Perfis carregados:', data);
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

  /** 🔹 Abre modal com detalhes e demandas */
  viewProfile(profile: Profile): void {
    console.log('👤 Visualizando perfil:', profile);
    this.selectedProfile = profile;
    this.showModal = true;
    this.loadDemandsForProfile(profile.cpf);
  }

  /** 🔹 Fecha o modal */
  closeModal(): void {
    this.showModal = false;
    this.selectedProfile = null;
    this.demands = [];
  }

  /** 🔹 Carrega as demandas do perfil */
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

  /** 🔹 Retorna imagem de avatar */
  getAvatarUrl(profile: any): string {
    if (!profile) return '';

    // ✅ Novo: imagem vem direto do banco como Base64
    if (profile.avatar) {
      return `data:image/jpeg;base64,${profile.avatar}`;
    }

    // 🔸 Fallback: usa avatar gerado pelo nome
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
