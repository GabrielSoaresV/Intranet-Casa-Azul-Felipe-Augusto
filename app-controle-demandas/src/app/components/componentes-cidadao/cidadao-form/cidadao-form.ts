import { Component, EventEmitter, Output } from '@angular/core';
import { CidadaoService } from '../../../services/cidadao';
import { CidadaoCreateDTO } from '../../../dtos/dto-cidadaos/cidadao-create.dto';
import Swal from 'sweetalert2';

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
  
  cidadao: CidadaoCreateDTO = { nome: '', cpf: '', email: '' };

  erroCPF: string = '';
  erroEmail: string = '';

  constructor(private cidadaoService: CidadaoService) {}

  validarCPF(): boolean {
    const somenteDigitos = this.cidadao.cpf.replace(/\D/g, '');
    if (somenteDigitos.length !== 11) {
      Swal.fire({ icon: 'warning', title: 'CPF inválido!', text: 'Por favor, corrija o CPF.' });
      return false;
    }
    return true;
  }

  validarEmail(): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(this.cidadao.email)) {
      Swal.fire({ icon: 'warning', title: 'Email inválido!', text: 'Por favor, corrija o email.' });
      return false;
    }
    return true;
  }

  cadastrarCidadao() {
    if (!this.validarCPF() || !this.validarEmail()) return;

    const dto: CidadaoCreateDTO = {
      ...this.cidadao,
      cpf: this.cidadao.cpf.replace(/\D/g, '')
    };

    this.cidadaoService.criar(dto).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Cidadão cadastrado com sucesso!',
          timer: 3000,
          showConfirmButton: false
        });
        this.cidadao = { nome: '', cpf: '', email: '' };
      },
      error: (err) => {
        if (err.status === 409) {
          Swal.fire({ icon: 'warning', title: 'Ops!', text: 'CPF já cadastrado!' });
        } else {
          Swal.fire({ icon: 'error', title: 'Erro!', text: 'Ocorreu um erro ao cadastrar o cidadão.' });
        }
      }
    });
  }


  aplicarMascaraCPF(event: Event): string {
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

    this.cidadao.cpf = valor;
    input.value = valor;
    return valor;
  }
}
