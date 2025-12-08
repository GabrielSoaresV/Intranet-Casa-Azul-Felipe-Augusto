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

  // Lista real que será enviada ao backend
  emailList: string[] = [];

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nomeEmpresa: ['', Validators.required],
      cnpj: ['', Validators.required],

      // Campo apenas para digitar um email por vez
      emailInput: [''],

      telefoneEmpresa: [''],
      rhNomeResponsavel: [''],
      rhEmailResponsavel: ['']
    });
  }

  addEmail(): void {
    const email = this.form.value.emailInput?.trim();

    if (!email) return;

    if (this.emailList.includes(email)) {
      this.errorMessage = 'Este e-mail já foi adicionado.';
      return;
    }

    this.emailList.push(email);

    this.form.patchValue({ emailInput: '' });
    this.errorMessage = '';
  }

  removeEmail(email: string): void {
    this.emailList = this.emailList.filter(e => e !== email);
  }

  submit(): void {
    if (this.form.invalid || this.emailList.length === 0) {
      this.errorMessage = 'Preencha os campos obrigatórios e adicione pelo menos 1 e-mail.';
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const empresa: Empresa = {
      cnpj: this.form.value.cnpj,
      nomeEmpresa: this.form.value.nomeEmpresa,
      emailEmpresa: this.emailList,
      telefoneEmpresa: this.form.value.telefoneEmpresa,
      rhNomeResponsavel: this.form.value.rhNomeResponsavel,
      rhEmailResponsavel: this.form.value.rhEmailResponsavel
    };

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
