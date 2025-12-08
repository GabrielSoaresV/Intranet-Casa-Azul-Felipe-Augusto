import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JovemService } from '../../../../core/services/jovem.service';
import { JovemAprendiz } from '../../../../models/jovem-aprendiz';

@Component({
  selector: 'app-modal-editar-jovem',
  standalone: false,
  templateUrl: './modal-edit-jovem.html',
  styleUrls: ['./modal-edit-jovem.css']
})

export class ModalEditarJovem implements OnInit {

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: JovemService,
    private dialogRef: MatDialogRef<ModalEditarJovem>,
    @Inject(MAT_DIALOG_DATA) public jovem: JovemAprendiz
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nome: [this.jovem.nome],
      telefone: [this.jovem.telefone],
      email: [this.jovem.email],
      contratacao: [this.jovem.contratacao],
      rescisao: [this.jovem.rescisao],
      periodoAvaliacao: [this.jovem.periodoAvaliacao],
      observacoes: [this.jovem.observacoes]
    });
  }

  salvar() {
    const atualizado = { ...this.jovem, ...this.form.value };

    this.service.atualizar(this.jovem.matricula, atualizado).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  cancelar() {
    this.dialogRef.close(false);
  }

}
