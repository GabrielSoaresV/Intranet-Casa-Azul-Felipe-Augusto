import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { UserResponse } from '../../models/user-response.model';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-perfil-usuario',
  standalone: false,
  templateUrl: './perfil-usuario.html',
  styleUrls: ['./perfil-usuario.css']
})
export class PerfilUsuario implements OnInit {

  usuario: UserResponse | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe({
      next: user => this.usuario = user,
      error: () => this.router.navigate(['/login'])
    });
  }

  formatarCPF(cpf: string) {
    if (!cpf) return '';
    return (
      cpf.substring(0, 3) + '.' +
      cpf.substring(3, 6) + '.' +
      cpf.substring(6, 9) + '-' +
      cpf.substring(9)
    );
  }

  irPara(rota: string) {
    this.router.navigate([rota]);
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
