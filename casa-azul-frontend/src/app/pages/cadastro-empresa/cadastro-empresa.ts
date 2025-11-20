import { Component } from '@angular/core';
import { EmpresaService } from '../../service/empresa';
import { InterfaceEmpresa } from '../../models/interface-empresa.model';

@Component({
  selector: 'app-cadastro-empresa',
  standalone: false,
  templateUrl: './cadastro-empresa.html',
  styleUrl: './cadastro-empresa.css'
})
export class CadastroEmpresa {

  formSelecionado: string = 'empresa';

  // Objeto que irá armazenar os dados do formulário
  empresa: InterfaceEmpresa = {
    cnpj: '',
    nomeEmpresa: '',
    emailEmpresa: '',
    telefoneEmpresa: '',
    rhNomeResponsavel: '',
    rhEmailResponsavel: ''
  };

  constructor(private empresaService: EmpresaService) {}

  // Função chamada ao enviar o formulário
  cadastrarEmpresa() {
    // Checa se o CNPJ está preenchido
    if (!this.empresa.cnpj) {
      alert('CNPJ é obrigatório!');
      return;
    }

    // Chamada ao backend
    this.empresaService.cadastrarEmpresa(this.empresa).subscribe({
      next: (res: InterfaceEmpresa) => {
        alert(`Empresa ${res.nomeEmpresa} cadastrada com sucesso!`);

        // Resetar o formulário
        this.empresa = {
          cnpj: '',
          nomeEmpresa: '',
          emailEmpresa: '',
          telefoneEmpresa: '',
          rhNomeResponsavel: '',
          rhEmailResponsavel: ''
        };
      },
      error: (err: any) => {
        console.error('Erro ao cadastrar empresa', err);
        alert('Erro ao cadastrar empresa. Veja o console.');
      }
    });
  }

  // Formata telefone enquanto digita
  formatarTelefone(event: any) {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 11) input = input.slice(0, 11);

    let formatted = '';
    if (input.length > 10) {
      formatted = `(${input.slice(0, 2)}) ${input.slice(2, 7)}-${input.slice(7)}`;
    } else if (input.length > 6) {
      formatted = `(${input.slice(0, 2)}) ${input.slice(2, 6)}-${input.slice(6)}`;
    } else if (input.length > 2) {
      formatted = `(${input.slice(0, 2)}) ${input.slice(2)}`;
    } else {
      formatted = input;
    }

    this.empresa.telefoneEmpresa = formatted;
  }
}
