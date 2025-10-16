import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  async onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const { error } = await this.supabase.signIn(this.email, this.password);

      if (error) {
        this.errorMessage = 'Email ou senha inválidos';
      } else {
        this.router.navigate(['/dashboard']);
      }
    } catch (error) {
      this.errorMessage = 'Erro ao fazer login. Tente novamente.';
    } finally {
      this.loading = false;
    }
  }
}
