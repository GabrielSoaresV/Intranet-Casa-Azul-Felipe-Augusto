package com.projetoavaliacao.model;

import jakarta.persistence.*;

@Entity
public class Associacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "idAvaliacao")
    private ModelAvaliacao avaliacao;

    @ManyToOne
    @JoinColumn(name = "id_jovem") 
    private JovemAprendiz jovem;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ModelAvaliacao getAvaliacao() { return avaliacao; }
    public void setAvaliacao(ModelAvaliacao avaliacao) { this.avaliacao = avaliacao; }

    public JovemAprendiz getJovem() { return jovem; }
    public void setJovem(JovemAprendiz jovem) { this.jovem = jovem; }

}
