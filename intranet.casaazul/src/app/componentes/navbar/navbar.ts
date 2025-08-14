import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  @Output() trocarTela = new EventEmitter<string>();
  constructor(private router: Router) {}

  navegar(rota: string) {
    this.router.navigate([rota]);
  }

  trocarParaRegister() {
    this.trocarTela.emit('register');
  }

  irParaRegisterEmpresa() {
    this.router.navigate(['empresa-register']);
  }

  get rotaAtual(): string {
    return this.router.url;
  }
}

