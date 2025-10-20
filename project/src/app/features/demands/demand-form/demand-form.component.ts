import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DemandService } from '../../../core/services/demand.service';
import { AuthService } from '../../../core/services/auth.service';
import { Demand } from '../../../shared/models/demand.model';

@Component({
  selector: 'app-demand-form',
  standalone: false,
  templateUrl: './demand-form.component.html',
  styleUrls: ['./demand-form.component.css']
})
export class DemandFormComponent implements OnInit {
  @Output() demandCreated = new EventEmitter<void>();

  demandForm!: FormGroup;
  saving = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private demandService: DemandService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.demandForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['MEDIUM', [Validators.required]],
      category: ['']
    });
  }

  onSubmit() {
    if (this.demandForm.invalid) {
      this.markFormGroupTouched(this.demandForm);
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'Usuário não autenticado';
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    const demandData: Demand = {
      title: this.demandForm.value.title,
      description: this.demandForm.value.description,
      priority: this.demandForm.value.priority,
      category: this.demandForm.value.category || undefined,
      status: 'PENDING',
      creator: currentUser
    };

    this.demandService.createDemand(demandData).subscribe({
      next: () => {
        this.saving = false;
        this.demandCreated.emit();
      },
      error: (error) => {
        console.error('Error creating demand:', error);
        this.errorMessage = 'Erro ao criar demanda. Tente novamente.';
        this.saving = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
