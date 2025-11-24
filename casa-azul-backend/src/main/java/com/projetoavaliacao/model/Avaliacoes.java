package com.projetoavaliacao.model;

import jakarta.persistence.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "AVALIACOES")
public class Avaliacoes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAvaliacao;

    @Lob
    private String avaliacao;
    private LocalDate dataAvaliacao;

    public enum TipoAvaliacao {
        UM, DOIS, TRES, FINAL;

        public static TipoAvaliacao proximo(TipoAvaliacao atual) {
            switch (atual) {
                case UM: return DOIS;
                case DOIS: return TRES;
                case TRES: return FINAL;
                default: return null; // FINAL não tem próximo
            }
        }
    }

    @Enumerated(EnumType.STRING)
    private TipoAvaliacao numeroAvaliacao;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "matricula_jovem", referencedColumnName = "matricula")
    private JovemAprendiz jovem;

    // Getters e Setters
    public Long getIdAvaliacao() { return idAvaliacao; }
    public void setIdAvaliacao(Long idAvaliacao) { this.idAvaliacao = idAvaliacao; }

    public String getAvaliacao() { return avaliacao; }
    public void setAvaliacao(String avaliacao) { this.avaliacao = avaliacao; }

    public LocalDate getDataAvaliacao() { return dataAvaliacao; }
    public void setDataAvaliacao(LocalDate dataAvaliacao) { this.dataAvaliacao = dataAvaliacao; }

    public TipoAvaliacao getNumeroAvaliacao() { return numeroAvaliacao; }
    public void setNumeroAvaliacao(TipoAvaliacao numeroAvaliacao) { this.numeroAvaliacao = numeroAvaliacao; }

    public JovemAprendiz getJovem() { return jovem; }
    public void setJovem(JovemAprendiz jovem) { this.jovem = jovem; }
}
