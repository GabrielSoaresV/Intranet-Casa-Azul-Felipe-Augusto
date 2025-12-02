import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../core/services/profile.service';
import { Profile } from '../../models/profile.model';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  profile: Profile | null = null;
  menuOpen = false;
  avatarUrl = '';

  constructor(
    private profileService: ProfileService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  loadProfile() {
    this.profileService.getCurrentProfile().subscribe({
      next: profile => {
        this.profile = profile;
        this.avatarUrl = this.getAvatarUrl(profile);
      },
      error: () => {}
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.auth.logout();
    this.profileService.logout();
    this.router.navigate(['/login']);
  }

  getAvatarUrl(profile: Profile | null): string {
    if (!profile) return '';
    if (profile.avatar) {
      return `data:image/jpeg;base64,${profile.avatar}`;
    }
    const name = encodeURIComponent(profile.name || 'Usuário');
    return `https://ui-avatars.com/api/?name=${name}&background=667eea&color=fff&bold=true`;
  }
}
