import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { AuthRequest } from '../../models/auth-request.model';

@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.html',
  styleUrl: './page-login.css',
  standalone: false
})
export class PageLogin {

  model: AuthRequest = {
    userlogin: '',
    password: ''
  };

  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.model).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/navigation']);
      },
      error: (err) => {
        this.loading = false;

        if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Falha no login. Verifique suas credenciais.';
        }
      }
    });
  }

}
