import { Component } from '@angular/core';

@Component({
  selector: 'app-servidor',
  standalone: false,
  templateUrl: './servidor.html',
  styleUrl: './servidor.css'
})
export class Servidor {
  servidor = { ip: '', porta: 3306 };

  salvarServidor() {
    console.log('Servidor salvo', this.servidor);
  }
}