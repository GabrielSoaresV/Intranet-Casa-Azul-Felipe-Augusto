import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/types';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: Profile | null = null;
  editMode = false;
  loading = true;
  saving = false;
  successMessage = '';

  editedProfile = {
    name: '',
    email: ''
  };

  constructor(private profileService: ProfileService) {}

  async ngOnInit() {
    await this.loadProfile();
  }

  async loadProfile() {
    try {
      this.loading = true;
      this.profile = await this.profileService.getCurrentProfile();
      if (this.profile) {
        this.editedProfile = {
          name: this.profile.name,
          email: this.profile.email
        };
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      this.loading = false;
    }
  }

  enableEdit() {
    this.editMode = true;
    this.successMessage = '';
  }

  cancelEdit() {
    this.editMode = false;
    if (this.profile) {
      this.editedProfile = {
        name: this.profile.name,
        email: this.profile.email
      };
    }
  }

  async saveProfile() {
    if (!this.editedProfile.name.trim()) {
      return;
    }

    this.saving = true;
    this.successMessage = '';

    try {
      await this.profileService.updateProfile({
        name: this.editedProfile.name,
        email: this.editedProfile.email
      });

      await this.loadProfile();
      this.editMode = false;
      this.successMessage = 'Perfil atualizado com sucesso!';

      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      this.saving = false;
    }
  }

  getRoleText(role: string): string {
    const roleMap: Record<string, string> = {
      'admin': 'Administrador',
      'attendant': 'Atendente'
    };
    return roleMap[role] || role;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
