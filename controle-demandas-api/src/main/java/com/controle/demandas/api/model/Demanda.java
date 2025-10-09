package com.controle.demandas.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Demanda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Título é obrigatório")
    private String titulo;

    private String descricao;

    @NotBlank
    @Builder.Default
    private String status = "Aberta";

    @ManyToOne
    @JoinColumn(name = "cidadao_cpf")
    @JsonBackReference
    private Cidadao cidadao;
}
