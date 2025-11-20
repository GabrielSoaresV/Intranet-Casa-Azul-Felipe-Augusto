import { Component } from '@angular/core';

@Component({
  selector: 'app-email',
  standalone: false,
  templateUrl: './email.html',
  styleUrl: './email.css'
})
export class Email {
  email = { remetente: '', senha: '', assuntoPadrao: '', corpoPadrao: '' };

  salvarEmail() {
    console.log('Email salvo', this.email);
  }
}