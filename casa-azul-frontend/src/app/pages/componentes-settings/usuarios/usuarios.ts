import { Component } from '@angular/core';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios {
  usuario = { nome: '', email: '', perfil: 'user' };

  salvarUsuario() {
    console.log('Usuário salvo', this.usuario);
  }
}