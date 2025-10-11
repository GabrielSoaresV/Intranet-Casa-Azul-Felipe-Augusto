import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-demanda-lista',
  standalone: false,
  templateUrl: './demanda-lista.html',
  styleUrl: './demanda-lista.css'
})
export class DemandaLista {
  @Output() componenteSelecionado = new EventEmitter<'cidadaos' | 'demandas'>(); 

  carregando = true;
  demandas = [];

  irParaCidadaos() {
    this.componenteSelecionado.emit('cidadaos');
  }

  alterarStatus(d: any) {
    console.log('Alterar status:', d);
  }

  excluirDemanda(id: number) {
    console.log('Excluir demanda:', id);
  }
}