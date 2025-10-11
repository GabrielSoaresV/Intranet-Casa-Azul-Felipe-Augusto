import { Cidadao } from './cidadao.model';

export interface Demanda {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
  cidadao: Cidadao;
}
