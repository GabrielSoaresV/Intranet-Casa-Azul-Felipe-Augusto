import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../../core/services/profile.service';
import { DemandService } from '../../../../core/services/demand.service';
import { Profile } from '../../../../models/profile.model';
import { Demand } from '../../../../models/demand.model';

@Component({
  selector: 'app-profiles-list',
  standalone: false,
  templateUrl: './profiles-list.html',
  styleUrls: ['./profiles-list.css']
})
export class ProfilesList implements OnInit {
  loading = true;
  profiles: Profile[] = [];
  filteredProfiles: Profile[] = [];
  searchTerm = '';

  showModal = false;
  selectedProfile: Profile | null = null;

  loadingDemands = false;
  demands: Demand[] = [];

  constructor(
    private profileService: ProfileService,
    private demandService: DemandService
  ) {}

  ngOnInit(): void {
    this.loadProfiles();
  }

  loadProfiles(): void {
    this.loading = true;
    this.profileService.getAll().subscribe({
      next: (data) => {
        this.profiles = data;
        this.filteredProfiles = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

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

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredProfiles = [...this.profiles];
  }

  viewProfile(profile: Profile): void {
    this.selectedProfile = profile;
    this.showModal = true;
    this.loadDemandsForProfile(profile.cpf);
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedProfile = null;
    this.demands = [];
  }

  loadDemandsForProfile(cpf: string): void {
    this.loadingDemands = true;
    this.demands = [];

    this.demandService.getDemandsByCreator(cpf).subscribe({
      next: (data) => {
        this.demands = data;
        this.loadingDemands = false;
      },
      error: () => {
        this.loadingDemands = false;
      }
    });
  }

  getAvatarUrl(profile: any): string {
    if (!profile) return '';
    if (profile.avatar) {
      return `data:image/jpeg;base64,${profile.avatar}`;
    }
    const name = encodeURIComponent(profile?.name || 'Usuário');
    return `https://ui-avatars.com/api/?name=${name}&background=667eea&color=fff&bold=true`;
  }

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
