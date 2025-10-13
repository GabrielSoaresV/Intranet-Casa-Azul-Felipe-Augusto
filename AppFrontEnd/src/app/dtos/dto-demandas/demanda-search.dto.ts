export class DemandaSearchDTO {
  id!: number;
  titulo!: string;
  descricao!: string;
  status!: "Aberta" | "Em Andamento" | "Concluída" | "Cancelada" | "Não Concluída";
  cpfCidadao!: string;
}
