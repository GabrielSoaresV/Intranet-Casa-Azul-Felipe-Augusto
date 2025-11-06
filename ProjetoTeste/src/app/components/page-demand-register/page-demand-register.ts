import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DemandService } from '../../core/services/demand.service';
import { Router } from '@angular/router';
import { Demand } from '../../models/demand.model';

@Component({
  selector: 'app-page-demand-register',
  standalone: false,
  templateUrl: './page-demand-register.html',
  styleUrl: './page-demand-register.css'
})
export class PageDemandRegister {
  form: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private demandService: DemandService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: [''],
      priority: ['MEDIUM', Validators.required],
      assignedUser: [null]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Preencha todos os campos obrigatórios.';
      this.form.markAllAsTouched(); // ✅ exibe erros nos campos
      return;
    }

    this.isSubmitting = true;

    const demand: Demand = {
      ...this.form.value,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    this.demandService.createDemand(demand).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Erro ao registrar demanda:', err);
        this.isSubmitting = false;
        this.errorMessage = 'Erro ao registrar demanda.';
      }
    });
  }
}