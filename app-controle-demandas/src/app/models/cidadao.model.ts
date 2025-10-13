import { InterfaceDemanda } from "./demanda.model";

export interface InterfaceCidadao {
  cpf: string;
  nome: string;
  email: string;
  demandas?: InterfaceDemanda[];
}
