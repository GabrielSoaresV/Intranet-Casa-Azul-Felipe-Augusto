import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cidadao-form',
  standalone: false,
  templateUrl: './cidadao-form.html',
  styleUrl: './cidadao-form.css'
})
export class CidadaoForm {
  @Output() componenteSelecionado = new EventEmitter<'cidadaos-form' | 'demandas-form'>();

  irParaDemandasForm() {
    this.componenteSelecionado.emit('demandas-form');
  }

  nome: string = '';
  cpf: string = '';
  email: string = '';

  cadastrarCidadao() {
    if (!this.email.includes('@') || !this.email.includes('.')) {
      console.warn('Email digitado pode ser inválido:', this.email);
    } else {
      console.log('Novo cidadão cadastrado:', {
        nome: this.nome,
        cpf: this.cpf.replace(/\D/g, ''),
        email: this.email
      });
    }
  }

  aplicarMascaraCPF(event: Event) {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '');

    if (valor.length > 11) valor = valor.substring(0, 11);

    if (valor.length > 9) {
      valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (valor.length > 6) {
      valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (valor.length > 3) {
      valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }

    this.cpf = valor;
    input.value = valor;
  }

  validarEmail() {
    if (!this.email.includes('@') || !this.email.includes('.')) {
      console.warn('Email digitado pode ser inválido:', this.email);
    } else {
      console.log('Email válido digitado:', this.email);
    }
  }
}
