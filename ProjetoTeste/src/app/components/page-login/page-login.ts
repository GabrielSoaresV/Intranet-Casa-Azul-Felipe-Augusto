import { Component } from '@angular/core';
import { ProfileService } from '../../core/services/profile.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-page-login',
  standalone: false,
  templateUrl: './page-login.html',
  styleUrl: './page-login.css'
})
export class PageLogin {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { login, password } = this.loginForm.value;

    this.profileService.login(login, password).subscribe({
      next: (response: any) => {
        console.log('💡 Resposta do backend:', response);

        // 🔧 Verifica se a resposta tem 'data' antes de acessar o token
        const token = response.data?.token ?? response.token;
        const role = response.data?.role ?? response.role;

        console.log('💾 Token identificado:', token);

        if (token) {
          this.authService.setToken(token);
        } else {
          console.warn('⚠️ Token não encontrado na resposta!');
        }

        // 🔁 Agora carrega o perfil
        this.profileService.getCurrentProfile().subscribe({
          next: (profile) => {
            console.log('👤 Perfil carregado:', profile);
            this.authService.setCurrentUser(profile);
            this.router.navigate(['/home']);
          },
          error: (error) => {
            console.error('Error loading profile:', error);
            this.errorMessage = 'Erro ao carregar perfil do usuário';
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'Credenciais inválidas. Tente novamente.';
        this.loading = false;
      }
    });
  }
}