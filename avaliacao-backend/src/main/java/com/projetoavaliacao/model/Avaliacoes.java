package com.projetoavaliacao.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "AVALIACOES")
public class Avaliacoes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAvaliacao;

    private String avaliacao;
    private LocalDate dataAvaliacao;
    private Integer numeroAvaliacao;

    // Getters e Setters
    public Long getIdAvaliacao() { return idAvaliacao; }
    public void setIdAvaliacao(Long idAvaliacao) { this.idAvaliacao = idAvaliacao; }

    public String getAvaliacao() { return avaliacao; }
    public void setAvaliacao(String avaliacao) { this.avaliacao = avaliacao; }

    public LocalDate getDataAvaliacao() { return dataAvaliacao; }
    public void setDataAvaliacao(LocalDate dataAvaliacao) { this.dataAvaliacao = dataAvaliacao; }

    public Integer getNumeroAvaliacao() { return numeroAvaliacao; }
    public void setNumeroAvaliacao(Integer numeroAvaliacao) { this.numeroAvaliacao = numeroAvaliacao; }
}
