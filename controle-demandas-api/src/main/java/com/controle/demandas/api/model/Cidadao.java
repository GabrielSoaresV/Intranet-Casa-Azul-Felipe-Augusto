package com.controle.demandas.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cidadao {

    @Id
    @NotBlank(message = "CPF é obrigatório")
    @Column(length = 11)
    private String cpf;

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @Email(message = "Email inválido")
    private String email;

    @OneToMany(mappedBy = "cidadao", cascade = CascadeType.ALL)
    @JsonManagedReference
    @Builder.Default
    private List<Demanda> demandas = new ArrayList<>();
}
