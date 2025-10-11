package com.controle.demandas.api.model;

import jakarta.persistence.*;
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
    private String cpf;

    private String nome;

    private String email;

    @OneToMany(mappedBy = "cidadao", cascade = CascadeType.ALL)
    @JsonManagedReference
    @Builder.Default
    private List<Demanda> demandas = new ArrayList<>();
}
