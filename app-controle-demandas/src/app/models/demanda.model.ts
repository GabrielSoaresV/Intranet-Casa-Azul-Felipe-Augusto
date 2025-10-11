import { CidadaoModel } from './cidadao.model';

export interface DemandaModel {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
  cidadao: CidadaoModel;
}
