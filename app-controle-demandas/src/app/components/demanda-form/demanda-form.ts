import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-demanda-form',
  standalone: false,
  templateUrl: './demanda-form.html',
  styleUrl: './demanda-form.css'
})
export class DemandaForm {
  @Output() componenteSelecionado = new EventEmitter<'cidadaos-form' | 'demandas-form'>();

  irParaCidadaosForm() {
    this.componenteSelecionado.emit('cidadaos-form');
  } 

  titulo: string = '';
  descricao: string = '';

  cadastrarDemanda() {
    const novaDemanda = {
      titulo: this.titulo,
      descricao: this.descricao,
      status: 'Aberta'
    };

  console.log('Nova demanda:', novaDemanda);
  }
}
