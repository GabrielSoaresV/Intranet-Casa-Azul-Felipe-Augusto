import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { Profile } from '../../models/profile.model';

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

  /** 🔹 Cadastra o usuário público como CITIZEN */
  register(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('⚠️ Preencha todos os campos corretamente.');
      return;
    }

    this.isLoading = true;

    // 🧩 Monta o objeto do novo usuário
    const newUser: Partial<Profile> = {
      name: this.form.value.name!,
      email: this.form.value.email!,
      cpf: this.form.value.cpf!,
      password: this.form.value.password!,
      role: 'CITIZEN' // sempre cidadão
    };

    // 🔹 Chama o endpoint público correto
    this.profileService.publicRegister(newUser).subscribe({
      next: () => {
        this.isLoading = false;
        alert('✅ Conta criada com sucesso! Faça login para continuar.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('❌ Erro ao registrar:', err);
        const msg = err?.error?.message || 'Erro ao criar conta. Tente novamente.';
        alert(`⚠️ ${msg}`);
      }
    });
  }

  /** 🔹 Exibe erro de campo no template */
  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
