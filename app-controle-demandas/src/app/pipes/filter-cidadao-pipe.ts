import { Pipe, PipeTransform } from '@angular/core';
import { InterfaceCidadao } from '../models/cidadao.model';

@Pipe({
  name: 'filterCidadaoPipe' // não-standalone
})
export class FilterCidadaoPipe implements PipeTransform {
  transform(cidadaos: InterfaceCidadao[], filtro: string): InterfaceCidadao[] {
    if (!cidadaos || !filtro) return cidadaos;

    const filtroLower = filtro.toLowerCase();

    return cidadaos.filter(c =>
      (c.nome && c.nome.toLowerCase().includes(filtroLower)) ||
      (c.email && c.email.toLowerCase().includes(filtroLower)) ||
      (c.cpf && c.cpf.replace(/\D/g, '').includes(filtro.replace(/\D/g, '')))
    );
  }
}
