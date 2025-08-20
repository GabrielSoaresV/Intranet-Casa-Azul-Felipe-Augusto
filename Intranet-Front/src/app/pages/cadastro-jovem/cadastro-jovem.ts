import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../service/empresa';
import { JovemService } from '../../service/jovem';
import { InterfaceEmpresa } from '../../models/interface-empresa.model';
import { InterfaceJovem } from '../../models/interface-jovem.model';

@Component({
  selector: 'app-cadastro-jovem',
  standalone: false,
  templateUrl: './cadastro-jovem.html',
  styleUrl: './cadastro-jovem.css'
})
export class CadastroJovem {
  formSelecionado: string = 'jovem';

  jovem: InterfaceJovem = {
    nome: '',
    matricula: '',
    contratacao: '',
    rescisao: '',
    periodoAvaliacao: '3',
    empresa: undefined,
    email: '',
    telefone: '',
    observacoes: '',
    nomeresponsavel: '',
    telefoneresponsavel: ''
  };

  empresas: InterfaceEmpresa[] = [];

  constructor(
    private empresaService: EmpresaService,
    private jovemService: JovemService
  ) {}

  ngOnInit(): void {
    this.carregarEmpresas();
  }

  carregarEmpresas() {
    this.empresaService.listar().subscribe({
      next: (data) => {
        this.empresas = data;
        console.log('Empresas carregadas:', this.empresas);
      },
      error: (err) => {
        console.error('Erro ao carregar empresas', err);
      }
    });
  }

  selecionarFormulario(tipo: string) {
    this.formSelecionado = tipo;
    console.log(`Formulário selecionado: ${tipo}`);
  }

  cadastrarJovem() {
    if (!this.jovem.empresa) {
      alert('Selecione uma empresa');
      return;
    }

    this.jovemService.cadastrar(this.jovem).subscribe({
      next: (res) => {
        alert(`Jovem ${res.nome} cadastrado com sucesso!`);
        
        this.jovem = {
          nome: '',
          matricula: '',
          contratacao: '',
          rescisao: '',
          periodoAvaliacao: '3',
          empresa: undefined,
          email: '',
          telefone: '',
          observacoes: '',
          nomeresponsavel: '',
          telefoneresponsavel: ''
        };
      },
      error: (err) => {
        console.error('Erro ao cadastrar jovem', err);
        alert('Erro ao cadastrar jovem. Veja o console.');
      }
    });
  }

  cadastrarEmpresa() {
    console.log('Cadastrar Empresa clicado');
  }

  cadastrarUsuario() {
    console.log('Cadastrar Usuário clicado');
  }

  formatarTelefone(event: any, tipo: 'jovem' | 'responsavel') {
    let valor = event.target.value.replace(/\D/g, ''); // remove tudo que não é número

    if (valor.length > 11) {
      valor = valor.substring(0, 11); // limita a 11 dígitos
    }

    // Aplica máscara
    if (valor.length > 6) {
      valor = `(${valor.substring(0,2)}) ${valor.substring(2,7)}-${valor.substring(7)}`;
    } else if (valor.length > 2) {
      valor = `(${valor.substring(0,2)}) ${valor.substring(2)}`;
    } else if (valor.length > 0) {
      valor = `(${valor}`;
    }

    // Atualiza a propriedade correta
    if (tipo === 'jovem') {
      this.jovem.telefone = valor;
    } else {
      this.jovem.telefoneresponsavel = valor;
    }
  }

}
