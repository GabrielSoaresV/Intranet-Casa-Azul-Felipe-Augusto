import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../../../core/services/profile.service';
import { Profile } from '../../../../models/profile.model';

@Component({
  selector: 'app-page-register-public',
  standalone: false,
  templateUrl: './page-register-public.html',
  styleUrls: ['./page-register-public.css']
})
export class PageRegisterPublic {
  isLoading = false;
  errorMessage: string | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router
  ) {}

  register(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Preencha todos os campos corretamente.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const newUser: Partial<Profile> = {
      name: this.form.value.name!,
      email: this.form.value.email!,
      cpf: this.form.value.cpf!,
      password: this.form.value.password!,
      role: 'CITIZEN'
    };

    this.profileService.publicRegister(newUser).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Conta criada com sucesso! Faça login para continuar.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Erro ao criar conta. Tente novamente.';
      }
    });
  }

  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
