import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-page-home',
  standalone: false,
  templateUrl: './page-home.html',
  styleUrl: './page-home.css'
})
export class PageHome implements OnInit {
  isStaff = false;   // ADMIN ou ATTENDANT
  isCitizen = false; // CITIZEN
  userName = '';

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.isStaff   = this.auth.hasAnyRole(['ADMIN', 'ATTENDANT']);
    this.isCitizen = this.auth.hasRole('CITIZEN');
    this.userName  = this.auth.getCurrentUser()?.name || 'Usuário';
  }
}
