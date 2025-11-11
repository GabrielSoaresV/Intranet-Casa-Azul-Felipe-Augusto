import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from '../../../../core/services/profile.service';
import { DemandService } from '../../../../core/services/demand.service';
import { Profile } from '../../../../models/profile.model';
import { Demand } from '../../../../models/demand.model';
import { ConfirmDialog, ConfirmDialogData } from '../../../../shared/confirm-dialog/confirm-dialog';

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

  isAdmin = false;

  constructor(
    private profileService: ProfileService,
    private demandService: DemandService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProfiles();
    this.checkIfAdmin();
  }

  checkIfAdmin(): void {
    const token = this.profileService.getToken();
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.isAdmin = payload.role === 'ADMIN';
    } catch {
      this.isAdmin = false;
    }
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

  onDelete(cpf: string, event: Event): void {
    event.stopPropagation();

    if (!this.isAdmin) {
      alert('Apenas administradores podem excluir usuários.');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: <ConfirmDialogData>{
        title: 'Excluir Usuário',
        subtitle: 'Essa ação não pode ser desfeita',
        message: 'Tem certeza que deseja excluir este usuário?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        color: 'warn',
        icon: 'delete_forever'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmed) {
        this.profileService.delete(cpf).subscribe({
          next: () => {
            this.loadProfiles();
          },
          error: (err) => {
            alert('Erro ao excluir usuário: ' + (err.error?.message || 'Tente novamente.'));
          }
        });
      }
    });
  }
}
