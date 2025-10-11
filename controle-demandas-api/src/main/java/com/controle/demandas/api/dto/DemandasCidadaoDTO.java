package com.controle.demandas.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandasCidadaoDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private String status;

    private String cpfCidadao;
    private String nomeCidadao;
    private String emailCidadao;
}
