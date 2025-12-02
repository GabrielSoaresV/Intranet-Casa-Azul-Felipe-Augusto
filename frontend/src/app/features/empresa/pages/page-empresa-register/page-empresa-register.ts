import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpresaService } from '../../../../core/services/empresa.service';
import { Router } from '@angular/router';
import { Empresa } from '../../../../models/empresa';

@Component({
  selector: 'app-page-empresa-register',
  standalone: false,
  templateUrl: './page-empresa-register.html',
  styleUrls: ['./page-empresa-register.css']
})
export class PageEmpresaRegister {

  form: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nomeEmpresa: ['', Validators.required],
      cnpj: ['', Validators.required],
      emailEmpresa: [''],
      telefoneEmpresa: [''],
      rhNomeResponsavel: [''],
      rhEmailResponsavel: ['']
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Preencha os campos obrigatórios.';
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const empresa: Empresa = this.form.value;

    this.empresaService.salvar(empresa).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/empresas']);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Erro ao registrar empresa.';
      }
    });
  }
}
