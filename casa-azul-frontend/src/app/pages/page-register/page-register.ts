import { Component } from '@angular/core';

@Component({
  selector: 'app-page-register',
  standalone: false,
  templateUrl: './page-register.html',
  styleUrls: ['./page-register.css']
})
export class PageRegister {

  formSelecionado: string = 'jovem';

  selecionarFormulario(tipo: string) {
    this.formSelecionado = tipo;
    console.log(`Formulário selecionado: ${tipo}`);
  }
}

