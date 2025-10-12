package com.controle.demandas.api.dtoDemandas;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandaStatusDTO {

    @NotBlank(message = "Ação de status é obrigatória")
    private String status;
}
