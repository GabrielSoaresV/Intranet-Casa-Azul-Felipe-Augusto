import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InterfaceDemanda } from '../../../models/demanda.model';
import { DemandaService } from '../../../services/demanda';

@Component({
  selector: 'app-demanda-editar',
  standalone: false,
  templateUrl: './demanda-editar.html',
  styleUrl: './demanda-editar.css'
})
export class DemandaEditar {

  demanda: InterfaceDemanda;

  constructor(
    public dialogRef: MatDialogRef<DemandaEditar>,
    @Inject(MAT_DIALOG_DATA) public data: InterfaceDemanda,
    private demandaService: DemandaService
  ) {
    this.demanda = { ...data }; 
  } 

  salvar() {

        console.error('Erro ao atualizar demanda:');
        alert('❌ Ocorreu um erro ao atualizar o demanda.');
    
  }

  cancelar() {
    this.dialogRef.close(false); 
  }
}
