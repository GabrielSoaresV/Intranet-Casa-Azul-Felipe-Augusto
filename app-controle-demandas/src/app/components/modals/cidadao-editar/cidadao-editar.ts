import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CidadaoModel } from '../../../models/cidadao.model';
import { CidadaoService } from '../../../services/cidadao';
@Component({
  selector: 'app-cidadao-editar',
  standalone: false,
  templateUrl: './cidadao-editar.html',
  styleUrl: './cidadao-editar.css'
})
export class CidadaoEditar {

  cidadao: CidadaoModel;

  constructor(
    public dialogRef: MatDialogRef<CidadaoEditar>,
    @Inject(MAT_DIALOG_DATA) public data: CidadaoModel,
    private cidadaoService: CidadaoService
  ) {
    this.cidadao = { ...data }; 
  } 

  salvar() {
    this.cidadaoService.atualizar(this.cidadao.cpf, this.cidadao).subscribe({
      next: () => {
        alert('✅ Cidadão atualizado com sucesso!');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Erro ao atualizar cidadão:', err);
        alert('❌ Ocorreu um erro ao atualizar o cidadão.');
      }
    });
  }

  cancelar() {
    this.dialogRef.close(false); 
  }
}
