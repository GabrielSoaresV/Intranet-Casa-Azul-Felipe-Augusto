package com.projetoavaliacao.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ASSOCIACAO")
public class Associacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_jovem", referencedColumnName = "matricula")
    private JovemAprendiz jovem;

    @ManyToOne
    @JoinColumn(name = "id_avaliacao", referencedColumnName = "idAvaliacao")
    private Avaliacoes avaliacao;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public JovemAprendiz getJovem() { return jovem; }
    public void setJovem(JovemAprendiz jovem) { this.jovem = jovem; }

    public Avaliacoes getAvaliacao() { return avaliacao; }
    public void setAvaliacao(Avaliacoes avaliacao) { this.avaliacao = avaliacao; }
}
