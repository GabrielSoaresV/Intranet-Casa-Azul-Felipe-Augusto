import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProfileService } from '../../services/profile.service';
import { DemandsService } from '../../services/demands.service';
import { Profile, Demand } from '../../models/types';
import { firstValueFrom } from 'rxjs';
import { HttpClientModule } from '@angular/common/http'; // ✅ importa HttpClientModule

@Component({
  selector: 'app-citizens',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HttpClientModule], // ✅ adiciona HttpClientModule
  templateUrl: './citizens.component.html',
  styleUrls: ['./citizens.component.css']
})
export class CitizensComponent implements OnInit {
  profiles: Profile[] = [];
  loading = true;
  showModal = false;
  selectedProfile: Profile | null = null;
  profileDemands: Demand[] = [];
  loadingDemands = false;

  constructor(
    private profileService: ProfileService,
    private demandsService: DemandsService
  ) {}

  async ngOnInit() {
    await this.loadProfiles();
  }

  async loadProfiles() {
    this.loading = true;
    try {
      this.profiles = await firstValueFrom(this.profileService.getAll());
    } catch (error) {
      console.error('Erro ao carregar perfis:', error);
    } finally {
      this.loading = false;
    }
  }

  async viewProfile(profile: Profile) {
    this.selectedProfile = profile;
    this.showModal = true;
    this.loadingDemands = true;

    try {
      this.profileDemands = await firstValueFrom(this.demandsService.getDemandsByCreator(profile.cpf));
    } catch (error) {
      console.error('Erro ao carregar demandas do perfil:', error);
    } finally {
      this.loadingDemands = false;
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedProfile = null;
    this.profileDemands = [];
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      pending: 'Pendente',
      in_progress: 'Em Andamento',
      completed: 'Concluída',
      cancelled: 'Cancelada'
    };
    return statusMap[status] || status;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
