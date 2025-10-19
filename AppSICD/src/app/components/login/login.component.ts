import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  login = '';      // <-- substitui email por login
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    if (!this.login || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.auth.login(this.login, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'CPF/Email ou senha inválidos';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
