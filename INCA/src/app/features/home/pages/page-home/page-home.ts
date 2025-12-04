import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-page-home',
  standalone: false,
  templateUrl: './page-home.html',
  styleUrls: ['./page-home.css']
})
export class PageHome implements OnInit {
  userName = '';
  role = '';

  constructor(public auth: AuthService) {}

  expandedCard: number | null = null;

  toggleCard(index: number) {
    this.expandedCard = this.expandedCard === index ? null : index;
  }

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    this.userName = user?.name || 'Usuário';
    this.role = user?.role || 'CITIZEN';
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  get isAttendant(): boolean {
    return this.auth.isAttendant();
  }

  get isCitizen(): boolean {
    return this.auth.isCitizen();
  }
}
