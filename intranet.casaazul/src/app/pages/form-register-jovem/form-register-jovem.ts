
import { Component, EventEmitter, Output } from '@angular/core';
import { JovemAprendiz } from '../../models/jovem-aprendiz.model';
import { InterfaceEmpresa } from '../../models/empresa.model';
import { EmpresaService } from '../../services/empresa';

@Component({
  selector: 'app-form-register-jovem',
  standalone: false,
  templateUrl: './form-register-jovem.html',
  styleUrl: './form-register-jovem.css',
})

export class FormRegisterJovem {
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

  empresas: InterfaceEmpresa[] = [];

  @Output() submitForm = new EventEmitter<JovemAprendiz>();

  constructor(private empresaService: EmpresaService) {
    this.carregarEmpresas();
  }

  carregarEmpresas() {
    this.empresaService.listar().subscribe(empresas => this.empresas = empresas);
  }

  cadastrarJovem() {
    this.submitForm.emit(this.jovem);
  }
}
