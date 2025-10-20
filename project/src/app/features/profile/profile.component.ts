import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { Profile } from '../../shared/models/profile.model';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentProfile: Profile | null = null;
  loading = false;
  saving = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  allProfiles: Profile[] = [];
  showAdminPanel = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.minLength(6)]]
    });

    this.loadCurrentProfile();

    if (this.authService.isAdmin()) {
      this.showAdminPanel = true;
      this.loadAllProfiles();
    }
  }

  loadCurrentProfile() {
    this.loading = true;
    this.profileService.getCurrentProfile().subscribe({
      next: (profile) => {
        this.currentProfile = profile;
        this.profileForm.patchValue({
          name: profile.name,
          email: profile.email,
          phone: profile.phone || ''
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.showMessage('Erro ao carregar perfil', 'error');
        this.loading = false;
      }
    });
  }

  loadAllProfiles() {
    this.profileService.getAllProfiles().subscribe({
      next: (profiles) => {
        this.allProfiles = profiles;
      },
      error: (error) => {
        console.error('Error loading profiles:', error);
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      return;
    }

    this.saving = true;
    const updates: Partial<Profile> = {
      name: this.profileForm.value.name,
      email: this.profileForm.value.email,
      phone: this.profileForm.value.phone
    };

    if (this.profileForm.value.password) {
      updates.password = this.profileForm.value.password;
    }

    this.profileService.updateCurrentProfile(updates).subscribe({
      next: (profile) => {
        this.currentProfile = profile;
        this.authService.setCurrentUser(profile);
        this.profileForm.patchValue({ password: '' });
        this.showMessage('Perfil atualizado com sucesso!', 'success');
        this.saving = false;
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.showMessage('Erro ao atualizar perfil', 'error');
        this.saving = false;
      }
    });
  }

  deleteProfile(cpf: string) {
    if (!confirm('Tem certeza que deseja deletar este perfil?')) {
      return;
    }

    this.profileService.deleteProfile(cpf).subscribe({
      next: () => {
        this.loadAllProfiles();
        this.showMessage('Perfil deletado com sucesso!', 'success');
      },
      error: (error) => {
        console.error('Error deleting profile:', error);
        this.showMessage('Erro ao deletar perfil', 'error');
      }
    });
  }

  private showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }
}
