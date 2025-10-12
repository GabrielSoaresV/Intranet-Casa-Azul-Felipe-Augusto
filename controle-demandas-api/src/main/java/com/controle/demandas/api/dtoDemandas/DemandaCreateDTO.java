package com.controle.demandas.api.dtoDemandas;

import jakarta.validation.constraints.NotBlank;
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

    @NotBlank(message = "CPF do cidadão é obrigatório")
    private String cpfCidadao;
}
