import { Pipe, PipeTransform } from '@angular/core';
import { CidadaoModel } from '../models/cidadao.model';

@Pipe({
  name: 'filterCidadao',
  standalone: false
})
export class FilterCidadaoPipe implements PipeTransform {
  transform(cidadaos: CidadaoModel[], filtro: string): CidadaoModel[] {
    if (!cidadaos || !filtro) return cidadaos;

    const filtroLower = filtro.toLowerCase();

    return cidadaos.filter(c => 
      c.nome.toLowerCase().includes(filtroLower) ||
      c.email.toLowerCase().includes(filtroLower) ||
      c.cpf.includes(filtroLower)
    );
  }
}
