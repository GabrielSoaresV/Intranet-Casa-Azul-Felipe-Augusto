import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DemandaService } from '../../../services/demanda';
import { InterfaceDemanda } from '../../../models/demanda.model';
import { InterfaceCidadao } from '../../../models/cidadao.model';

@Component({
  selector: 'app-listar-demandas-cidadao',
  standalone: false,
  templateUrl: './listar-demandas-cidadao.html',
  styleUrls: ['./listar-demandas-cidadao.css']
})
export class ListarDemandasCidadao implements OnInit {

  demandas: InterfaceDemanda[] = [];
  demandaSelecionada: InterfaceDemanda | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ListarDemandasCidadao>,
    @Inject(MAT_DIALOG_DATA) public cidadao: InterfaceCidadao,
    private demandaService: DemandaService
  ) {}

  ngOnInit() {
    this.demandaService.listarPorCidadao(this.cidadao.cpf).subscribe({
      next: (res: any) => {
        this.demandas = res.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.demandas = [];
        this.cdr.detectChanges();
      }
    });
  }

  selecionarDemanda(demanda: InterfaceDemanda) {
    this.demandaSelecionada = this.demandaSelecionada === demanda ? null : demanda;
  }

  fechar() {
    this.dialogRef.close();
  }
}