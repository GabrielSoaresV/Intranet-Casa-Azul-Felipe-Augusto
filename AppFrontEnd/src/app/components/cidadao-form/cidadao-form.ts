import { Component, Output, EventEmitter } from '@angular/core';
import { CidadaoCreateDTO } from '../../dtos/dto-cidadaos/cidadao-create.dto';
import { CidadaoService } from '../../services/cidadao';
import { CidadaoSearchDTO } from '../../dtos/dto-cidadaos/cidadao-search.dto';

@Component({
  selector: 'app-cidadao-form',
  standalone: false,
  templateUrl: './cidadao-form.html',
  styleUrls: ['./cidadao-form.css']
})
export class CidadaoForm {
  @Output() componenteSelecionado = new EventEmitter<'cidadaos-list' | 'cidadao-form' | 'demandas-list' | 'demanda-form'>();

  cidadao: CidadaoCreateDTO = new CidadaoCreateDTO();

  constructor(private cidadaoService: CidadaoService) {}

  salvar() {
    this.cidadaoService.criar(this.cidadao).subscribe({
      next: (res: CidadaoSearchDTO) => {
        alert('Cidadão cadastrado com sucesso!');
        this.cidadao = new CidadaoCreateDTO();
        this.componenteSelecionado.emit('cidadaos-list');
      },
      error: (err: any) => {
        console.error('Erro ao cadastrar cidadão:', err);
        alert('Erro ao cadastrar cidadão. Verifique o console.');
      }
    });
  }

  cancelar() {
    this.componenteSelecionado.emit('cidadaos-list');
  }
}
