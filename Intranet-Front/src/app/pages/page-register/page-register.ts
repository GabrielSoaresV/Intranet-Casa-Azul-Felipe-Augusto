import { Component } from '@angular/core';


interface InterfaceEmpresa {
  nomeEmpresa: string;
}

interface InterfaceJovem {
  nome: string;
  matricula: string;
  contratacao: string;
  rescisao?: string;
  periodoAvaliacao: number;
  empresa?: InterfaceEmpresa;
  nomeresponsavel?: string;
  telefoneresponsavel?: string;
  email?: string;
  observacoes?: string;
}

@Component({
  selector: 'app-page-register',
  standalone: false,
  templateUrl: './page-register.html',
  styleUrl: './page-register.css'
})
export class PageRegister {

  // Variáveis de exemplo
  formSelecionado: string = 'jovem';
  jovem: InterfaceJovem = {
    nome: '',
    matricula: '',
    contratacao: '',
    periodoAvaliacao: 3
  };
  empresas: InterfaceEmpresa[] = [
    { nomeEmpresa: 'Empresa A' },
    { nomeEmpresa: 'Empresa B' }
  ];

  // Alternar formulário
  selecionarFormulario(tipo: string) {
    this.formSelecionado = tipo;
    console.log(`Formulário selecionado: ${tipo}`);
  }

  // Cadastrar jovem
  cadastrarJovem() {
    console.log('Cadastrar Jovem:', this.jovem);
    alert(`Jovem ${this.jovem.nome} cadastrado com sucesso!`);
  }

  // Funções simuladas para menu lateral
  cadastrarEmpresa() {
    console.log('Cadastrar Empresa clicado');
  }

  cadastrarUsuario() {
    console.log('Cadastrar Usuário clicado');
  }
}
