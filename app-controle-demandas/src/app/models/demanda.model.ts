import { InterfaceCidadao } from "./cidadao.model";

export interface InterfaceDemanda {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
  cidadao: InterfaceCidadao;
}
