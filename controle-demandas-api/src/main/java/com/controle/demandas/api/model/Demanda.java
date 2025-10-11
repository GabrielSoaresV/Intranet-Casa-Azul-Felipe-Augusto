package com.controle.demandas.api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Demanda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Título da demanda é obrigatório")
    private String titulo;

    @NotBlank(message = "Descrição da demanda é obrigatória")
    private String descricao;

    private String status;

    @ManyToOne
    @JoinColumn(name = "cidadao_cpf", nullable = false)
    @JsonBackReference
    private Cidadao cidadao;

}
