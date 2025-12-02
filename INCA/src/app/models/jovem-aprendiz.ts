import { Empresa } from "./empresa";
import { Avaliacao } from "./avaliacao";

export interface JovemAprendiz {
  matricula: string;
  nome: string;
  contratacao?: string;
  rescisao?: string;
  empresa?: Empresa;
  periodoAvaliacao?: string;
  email: string;
  telefone: string;
  nomeresponsavel: string;
  telefoneresponsavel: string;
  observacoes?: string;

  avaliacoes?: Avaliacao[];
  nomeEmpresa?: string;
  ultimaAvaliacao?: string;
}
