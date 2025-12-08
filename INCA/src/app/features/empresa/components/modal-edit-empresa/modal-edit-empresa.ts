import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Empresa } from '../../../../models/empresa';
import { EmpresaService } from '../../../../core/services/empresa.service';

@Component({
  selector: 'app-modal-editar-empresa',
  standalone: false,
  templateUrl: './modal-edit-empresa.html',
  styleUrls: ['./modal-edit-empresa.css']
})
export class ModalEditarEmpresa implements OnInit {

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: EmpresaService,
    private dialogRef: MatDialogRef<ModalEditarEmpresa>,
    @Inject(MAT_DIALOG_DATA) public empresa: Empresa
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nomeEmpresa: [this.empresa.nomeEmpresa, Validators.required],
      telefoneEmpresa: [this.empresa.telefoneEmpresa],
      rhNomeResponsavel: [this.empresa.rhNomeResponsavel],
      rhEmailResponsavel: [this.empresa.rhEmailResponsavel],
      emailEmpresa: this.fb.array([]) // ✅ AGORA É UM FORMARRAY DE VERDADE
    });

    // ✅ Preenche os emails existentes
    if (this.empresa.emailEmpresa?.length) {
      this.empresa.emailEmpresa.forEach(email => {
        this.adicionarEmail(email);
      });
    } else {
      this.adicionarEmail(); // pelo menos 1 campo
    }
  }

  // 🔽 Getter do FormArray
  get emails(): FormArray {
    return this.form.get('emailEmpresa') as FormArray;
  }

  // ✅ Adicionar novo campo de email
  adicionarEmail(valor: string = '') {
    this.emails.push(
      this.fb.control(valor, [Validators.email])
    );
  }

  // ✅ Remover email
  removerEmail(index: number) {
    this.emails.removeAt(index);
  }

  salvar() {
    const atualizado: Empresa = {
      ...this.empresa,
      ...this.form.value,
      emailEmpresa: this.form.value.emailEmpresa.filter((e: string) => e?.trim())
    };

    this.service.atualizar(this.empresa.cnpj, atualizado).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
