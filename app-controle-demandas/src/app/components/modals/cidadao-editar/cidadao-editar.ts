import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CidadaoUpdateDTO } from '../../../dtos/dto-cidadaos/cidadao-update.dto';
import { CidadaoService } from '../../../services/cidadao';

@Component({
  selector: 'app-cidadao-editar',
  standalone: false,
  templateUrl: './cidadao-editar.html',
  styleUrl: './cidadao-editar.css'
})
export class CidadaoEditar {

  cidadao: { cpf: string; nome: string; email: string };

  constructor(
    public dialogRef: MatDialogRef<CidadaoEditar>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cidadaoService: CidadaoService
  ) {
    this.cidadao = { cpf: data.cpf, nome: data.nome, email: data.email };
  }

  salvar() {
    const atualizado: CidadaoUpdateDTO = {
      nome: this.cidadao.nome,
      email: this.cidadao.email
    };

    this.cidadaoService.atualizar(this.cidadao.cpf, atualizado).subscribe({
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
