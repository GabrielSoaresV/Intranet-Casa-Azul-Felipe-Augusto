import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/types';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http'; // ✅ importa HttpClientModule

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, HttpClientModule], // ✅ adiciona HttpClientModule
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: Profile | null = null;
  editMode = false;
  loading = true;
  saving = false;
  successMessage = '';
  editedProfile: Partial<Profile> = { name: '', email: '' };

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.profileService.getCurrentProfile().subscribe({
      next: profile => {
        this.profile = profile;
        if (profile) this.editedProfile = { name: profile.name, email: profile.email };
        this.loading = false;
      },
      error: err => {
        console.error('Erro ao carregar perfil:', err);
        this.loading = false;
      }
    });
  }

  enableEdit() { this.editMode = true; this.successMessage = ''; }
  cancelEdit() {
    this.editMode = false;
    if (this.profile) this.editedProfile = { name: this.profile.name, email: this.profile.email };
  }

  saveProfile() {
    if (!this.editedProfile.name?.trim()) return;
    this.saving = true;
    this.successMessage = '';
    this.profileService.updateCurrentProfile(this.editedProfile).subscribe({
      next: updated => {
        this.profile = updated;
        this.editMode = false;
        this.successMessage = 'Perfil atualizado com sucesso!';
        this.saving = false;
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: err => { console.error('Erro ao atualizar perfil:', err); this.saving = false; }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  getRoleText(role: string): string {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'ATTENDANT': return 'Atendente';
      case 'CITIZEN': return 'Cidadão';
      default: return role;
    }
  }
}
