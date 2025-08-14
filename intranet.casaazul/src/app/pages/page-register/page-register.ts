import { Component, OnInit } from '@angular/core';
import { JovemAprendiz } from '../../models/jovem-aprendiz.model';
import { InterfaceEmpresa } from '../../models/empresa.model';
import { EmpresaService } from '../../services/empresa';
import { FormRegisterJovem } from '../form-register-jovem/form-register-jovem';
import { FormRegisterEmpresa} from '../form-register-empresa/form-register-empresa';
import { FormRegisterFuncionario } from '../form-register-funcionario/form-register-funcionario';

@Component({
  selector: 'app-page-register',
  standalone: false,
  templateUrl: './page-register.html',
  styleUrls: ['./page-register.css']
})
export class PageRegister implements OnInit {
  telaAtual: string = 'form';

  formSelecionado = 'jovem';

  empresas: InterfaceEmpresa[] = [];

  jovem: JovemAprendiz = {
    nome: '',
    matricula: '',
    contratacao: '',
    rescisao: '',
    empresa: {
      cnpj: '',
      nomeEmpresa: '',
      emailEmpresa: '',
      telefoneEmpresa: '',
      rhNomeResponsavel: '',
      rhEmailResponsavel: ''
    },
    periodoAvaliacao: '',
    email: '',
    telefone: '',
    observacoes: '',
    nomeresponsavel: '',
    telefoneresponsavel: ''
  };

  constructor(private empresaService: EmpresaService) {}

  ngOnInit() {
    this.carregarEmpresas();
  }

  carregarEmpresas() {
    this.empresaService.listar().subscribe({
      next: (dados) => {
        this.empresas = dados;
      },
      error: (erro) => {
        console.error('Erro ao carregar empresas', erro);
      }
    });
  }

  trocarTela(tela: string) {
    this.telaAtual = tela;
  }

  cadastrarEmpresa(event: Event) {
    event.preventDefault();
    console.log('Cadastrar Empresa - formulário enviado');
  }

  cadastrarFuncionario(event: Event) {
    event.preventDefault();
    console.log('Cadastrar Funcionário - formulário enviado');
  }

  selecionarForm(form: string) {
    this.formSelecionado = form;
  }

  cadastrarJovem(dados: any) {
    console.log('Dados cadastrados do jovem:', dados);
    // Chamada para backend ou lógica de salvar
  }
}

