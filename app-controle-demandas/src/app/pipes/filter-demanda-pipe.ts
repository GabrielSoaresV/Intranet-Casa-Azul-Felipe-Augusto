import { Pipe, PipeTransform } from '@angular/core';
import { InterfaceDemanda } from '../models/demanda.model';

@Pipe({
  name: 'filterDemandaPipe'
})
export class FilterDemandaPipe implements PipeTransform {
  transform(demandas: InterfaceDemanda[], filtro: string): InterfaceDemanda[] {
    if (!demandas || !filtro) return demandas;

    const filtroLower = filtro.toLowerCase();
    return demandas.filter(d =>
      d.titulo.toLowerCase().includes(filtroLower) ||
      (d.descricao && d.descricao.toLowerCase().includes(filtroLower)) ||
      (d.status && d.status.toLowerCase().includes(filtroLower))
    );
  }
}
