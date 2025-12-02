import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../../../core/services/profile.service';
import { Profile } from '../../../../models/profile.model';

@Component({
  selector: 'app-page-register-private',
  standalone: false,
  templateUrl: './page-register-private.html',
  styleUrls: ['./page-register-private.css']
})
export class PageRegisterPrivate {
  isLoading = false;
  errorMessage: string | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['CITIZEN', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router
  ) {}

  createUser(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Preencha todos os campos corretamente.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const user: Profile = {
      name: this.form.value.name || '',
      email: this.form.value.email || '',
      cpf: this.form.value.cpf || '',
      password: this.form.value.password || '',
      role: (this.form.value.role as 'ADMIN' | 'ATTENDANT' | 'CITIZEN') || 'CITIZEN'
    };

    this.profileService.create(user).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Usuário criado com sucesso!');
        this.router.navigate(['/profile-list']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Erro ao criar usuário. Tente novamente.';
      }
    });
  }

  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
