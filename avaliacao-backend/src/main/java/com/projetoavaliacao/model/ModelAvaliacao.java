package com.projetoavaliacao.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class ModelAvaliacao {

    @Id
    @Column(name = "idAvaliacao")
    private String idAvaliacao;

    private String avaliacao;

    private LocalDate dataAvaliacao;

    // Getters e Setters
    public String getIdAvaliacao() { return idAvaliacao; }
    public void setIdAvaliacao(String idAvaliacao) { this.idAvaliacao = idAvaliacao; }

    public String getAvaliacao() { return avaliacao; }
    public void setAvaliacao(String avaliacao) { this.avaliacao = avaliacao; }

    public LocalDate getDataAvaliacao() { return dataAvaliacao; }
    public void setDataAvaliacao(LocalDate dataAvaliacao) { this.dataAvaliacao = dataAvaliacao; }
}
