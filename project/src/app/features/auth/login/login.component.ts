import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { login, password } = this.loginForm.value;

    this.profileService.login(login, password).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);

        this.profileService.getCurrentProfile().subscribe({
          next: (profile) => {
            this.authService.setCurrentUser(profile);
            this.router.navigate(['/demands']);
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
