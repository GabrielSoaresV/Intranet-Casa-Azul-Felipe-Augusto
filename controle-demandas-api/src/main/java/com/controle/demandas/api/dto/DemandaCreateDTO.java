package com.controle.demandas.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandaCreateDTO {

    @NotBlank(message = "Título da demanda é obrigatório")
    private String titulo;

    @NotBlank(message = "Descrição da demanda é obrigatória")
    private String descricao;

    @NotNull(message = "CPF do cidadão é obrigatório")
    private String cpfCidadao;
}
