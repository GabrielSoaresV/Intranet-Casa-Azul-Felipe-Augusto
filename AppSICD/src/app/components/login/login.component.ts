import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { HttpClientModule } from '@angular/common/http'; // ✅ importa HttpClientModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // ✅ adiciona HttpClientModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  login = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private profileService: ProfileService, private router: Router) {}

  onLogin() {
    if (!this.login || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.profileService.login(this.login, this.password)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => {
          console.error('Erro no login:', err);
          if (err.status === 401) this.errorMessage = 'CPF/Email ou senha inválidos';
          else this.errorMessage = 'Erro ao conectar ao servidor';
        }
      });
  }
}
