package com.controle.demandas.api.dtoCidadaos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CidadaoSearchDTO {

    private String cpf;
    private String nome;
    private String email;
}