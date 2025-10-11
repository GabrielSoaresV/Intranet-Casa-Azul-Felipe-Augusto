import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cidadao-lista',
  standalone: false,
  templateUrl: './cidadao-lista.html',
  styleUrls: ['./cidadao-lista.css']
})
export class CidadaoLista {
  @Output() componenteSelecionado = new EventEmitter<'cidadaos' | 'demandas'>();

  carregando = true;

  cidadaos = [];

  irParaDemandas() {
    this.componenteSelecionado.emit('demandas');
  }

  editarCidadao(d: any) {
    console.log('Alterar cidadao:');
  }

  excluirCidadao(id: number) {
    console.log('Excluir cidadao:');
  }
}