import { InterfaceEmpresa } from "./interface-empresa.model";

export interface InterfaceJovem {
  nome: string;
  matricula: string;
  contratacao: string; 
  rescisao: string;
  empresa?: InterfaceEmpresa;
  periodoAvaliacao: string;
  email?: string;
  telefone?: string;
  observacoes?: string;
  nomeresponsavel?: string;     
  telefoneresponsavel?: string;  
  ultimaAvaliacao?: string | null;

}
