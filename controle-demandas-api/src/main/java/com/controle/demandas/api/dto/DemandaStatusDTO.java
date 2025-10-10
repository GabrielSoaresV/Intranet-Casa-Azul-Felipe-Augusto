package com.controle.demandas.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandaStatusDTO {
    @NotBlank(message = "Ação de status é obrigatória")
    private String acao;
}
