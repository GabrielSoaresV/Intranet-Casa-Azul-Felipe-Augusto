import { InterfaceEmpresa } from "./empresa.model";

export interface JovemAprendiz {
  nome: string;
  matricula: string;
  contratacao: string; 
  rescisao: string;
  empresa: InterfaceEmpresa;
  periodoAvaliacao: string;
  email?: string;
  telefone?: string;
  observacoes?: string;
  nomeresponsavel?: string;     
  telefoneresponsavel?: string;  

}
