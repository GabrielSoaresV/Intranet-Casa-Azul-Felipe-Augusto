import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-login',
  standalone: false,
  templateUrl: './page-login.html',
  styleUrl: './page-login.css'
})
export class PageLogin {
  constructor(private router: Router) {}

  irParaNavigation() {
    this.router.navigate(['/navigation']);
  }
}

