import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { Profile } from '../../models/profile.model';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class PageProfile implements OnInit {
  loading = true;
  editing = false;
  saving = false;

  profile: Profile | null = null;
  avatarUrl: string = '';
  selectedFile: File | null = null;
  form!: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(private profileService: ProfileService, private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log('👤 PageProfile carregado');
    this.loadProfile();
  }

  /** 🔹 Carrega perfil e avatar juntos */
  loadProfile(): void {
    this.profileService.getCurrentProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.initForm(data);
        this.loadAvatar(); // busca o avatar real no banco
        this.loading = false;
        console.log('✅ Perfil carregado:', this.profile);
      },
      error: (err) => {
        console.error('❌ Erro ao carregar perfil:', err);
        this.loading = false;
      }
    });
  }

  /** 🔹 Busca avatar (imagem em bytes → base64) */
  loadAvatar(): void {
    this.profileService.getAvatar()
      .pipe(
        catchError((err) => {
          console.warn('⚠️ Sem avatar encontrado, usando fallback');
          this.avatarUrl = this.getFallbackAvatar();
          return of(null);
        })
      )
      .subscribe((dataUrl) => {
        if (dataUrl) {
          this.avatarUrl = dataUrl;
          console.log('🖼️ Avatar carregado do banco com sucesso.');
        }
      });
  }

  /** 🔹 Retorna avatar gerado com nome (fallback) */
  getFallbackAvatar(): string {
    const name = encodeURIComponent(this.profile?.name || 'Usuário');
    return `https://ui-avatars.com/api/?name=${name}&background=667eea&color=fff&bold=true`;
  }

  /** 🔹 Inicializa o formulário */
  initForm(profile: Profile): void {
    this.form = this.fb.group({
      name: [profile.name, [Validators.required, Validators.minLength(3)]],
      email: [profile.email, [Validators.required, Validators.email]],
      phone: [profile.phone, [Validators.pattern(/^\d{10,11}$/)]],
      password: [''] // opcional
    });
  }

  /** 🔹 Alterna entre modo de edição e exibição */
  toggleEdit(): void {
    this.editing = !this.editing;
    this.successMessage = '';
    this.errorMessage = '';
    if (this.profile) this.initForm(this.profile);
  }

  /** 🔹 Atualiza dados no servidor */
  saveChanges(): void {
    if (this.form.invalid) return;

    this.saving = true;
    const updates = this.form.value;

    this.profileService.updateCurrentProfile(updates).subscribe({
      next: (updated) => {
        this.profile = updated;
        this.avatarUrl = this.avatarUrl || this.getFallbackAvatar();
        this.editing = false;
        this.saving = false;
        this.successMessage = '✅ Perfil atualizado com sucesso!';
        this.errorMessage = '';
        console.log('💾 Perfil salvo:', updated);
      },
      error: (err) => {
        console.error('❌ Erro ao atualizar perfil:', err);
        this.saving = false;
        this.errorMessage = 'Falha ao atualizar perfil. Tente novamente.';
      }
    });
  }

  /** 🔹 Upload do avatar */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // preview imediato
      const reader = new FileReader();
      reader.onload = (e: any) => this.avatarUrl = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  uploadAvatar(): void {
    if (!this.selectedFile) return;
    this.saving = true;

    this.profileService.uploadAvatar(this.selectedFile).subscribe({
      next: (updated) => {
        this.profile = updated;
        this.loadAvatar(); // recarrega imagem do backend
        this.selectedFile = null;
        this.saving = false;
        this.successMessage = '✅ Foto de perfil atualizada!';
      },
      error: (err) => {
        console.error('❌ Erro no upload:', err);
        this.errorMessage = 'Erro ao enviar imagem.';
        this.saving = false;
      }
    });
  }

  cancelAvatarSelection(): void {
    this.selectedFile = null;
    this.loadAvatar();
    this.successMessage = '';
    this.errorMessage = '';
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

  /** 🔹 Tradução da role */
  getRoleText(role: string): string {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'ATTENDANT': return 'Atendente';
      case 'CITIZEN': return 'Cidadão';
      default: return 'Desconhecido';
    }
  }
}
