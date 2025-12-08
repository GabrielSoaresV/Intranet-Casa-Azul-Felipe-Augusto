import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { JovemService } from '../../../../core/services/jovem.service';
import { EmpresaService } from '../../../../core/services/empresa.service';
import { Empresa } from '../../../../models/empresa';
import { JovemAprendiz } from '../../../../models/jovem-aprendiz';

@Component({
  selector: 'app-jovem-register',
  standalone: false,
  templateUrl: './page-jovem-register.html',
  styleUrls: ['./page-jovem-register.css']
})
export class PageJovemRegister implements OnInit {

  form: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  empresas: Empresa[] = [];
  empresasFiltradas: Empresa[] = [];

  empresaInput = new FormControl('');
  empresaSelecionada: Empresa | null = null;

  formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private jovemService: JovemService,
    private empresaService: EmpresaService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      matricula: ['', Validators.required],
      contratacao: [''],
      rescisao: [''],
      periodoAvaliacao: [''],
      email: [''],
      telefone: [''],
      observacoes: ['']
    });
  }

  ngOnInit(): void {
    this.carregarEmpresas();

    this.empresaInput.valueChanges.subscribe(text => {
      this.filtrarEmpresas(text || '');
    });
  }

  carregarEmpresas() {
    this.empresaService.listarTodas().subscribe(empresas => {
      this.empresas = empresas;
      this.empresasFiltradas = empresas;
    });
  }

  filtrarEmpresas(texto: string) {
    const busca = texto.toLowerCase();
    this.empresasFiltradas = this.empresas.filter(e =>
      e.nomeEmpresa.toLowerCase().includes(busca) ||
      e.cnpj.includes(texto)
    );
  }

  selecionarEmpresa(nome: string) {
    this.empresaSelecionada = this.empresas.find(e => e.nomeEmpresa === nome) || null;
  }

  submit() {
    this.formSubmitted = true;

    if (this.form.invalid || !this.empresaSelecionada) {
      this.errorMessage = 'Preencha todos os campos obrigatórios.';
      this.form.markAllAsTouched();
      return;
    }

    const jovem: JovemAprendiz = {
      ...this.form.value,
      empresa: this.empresaSelecionada
    };

    this.isSubmitting = true;

    this.jovemService.salvar(jovem).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/jovens']);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Erro ao cadastrar jovem.';
      }
    });
  }
}
