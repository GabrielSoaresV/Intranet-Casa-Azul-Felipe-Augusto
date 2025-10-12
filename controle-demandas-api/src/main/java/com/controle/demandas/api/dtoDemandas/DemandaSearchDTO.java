package com.controle.demandas.api.dtoDemandas;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandaSearchDTO {

    private Long id;
    private String titulo;
    private String descricao;
    private String status;
    private String cpfCidadao;
}
