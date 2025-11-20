import { Component } from '@angular/core';

@Component({
  selector: 'app-preferencias',
  standalone: false,
  templateUrl: './preferencias.html',
  styleUrl: './preferencias.css'
})
export class Preferencias {
  preferencias = { idioma: 'pt', tema: 'claro' };

  salvarPreferencias() {
    console.log('Preferências salvas', this.preferencias);
  }
}