import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  profile: Profile | null = null;
  menuOpen = false;

  constructor(private profileService: ProfileService, private router: Router) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getCurrentProfile().subscribe({
      next: profile => this.profile = profile,
      error: err => console.error('Erro ao carregar perfil:', err)
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.profileService.logout();
    this.router.navigate(['/login']); // redireciona para login
  }
}
