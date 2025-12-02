export type TipoAvaliacao = 'UM' | 'DOIS' | 'TRES' | 'FINAL';

export interface Avaliacao {
  idAvaliacao?: number;
  avaliacao: string;
  dataAvaliacao?: string;
  numeroAvaliacao?: TipoAvaliacao;
}
