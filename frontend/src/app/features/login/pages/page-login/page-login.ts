import { Component } from '@angular/core';
import { ProfileService } from '../../../../core/services/profile.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-page-login',
  standalone: false,
  templateUrl: './page-login.html',
  styleUrls: ['./page-login.css']
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
        const token = response.data?.token ?? response.token;

        if (token) {
          this.authService.setToken(token);
        } else {
          this.errorMessage = 'Erro ao autenticar. Token não encontrado.';
          this.loading = false;
          return;
        }

        this.profileService.getCurrentProfile().subscribe({
          next: (profile) => {
            this.authService.setCurrentUser(profile);
            this.router.navigate(['/home']);
          },
          error: () => {
            this.errorMessage = 'Erro ao carregar perfil do usuário.';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.errorMessage = 'Credenciais inválidas. Tente novamente.';
        this.loading = false;
      }
    });
  }
}
