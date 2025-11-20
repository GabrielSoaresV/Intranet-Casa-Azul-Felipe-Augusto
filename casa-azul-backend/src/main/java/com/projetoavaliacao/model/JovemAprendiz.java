package com.projetoavaliacao.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class JovemAprendiz {

    @Id
    private String matricula;

    private String nome;
    private LocalDate contratacao;
    private LocalDate rescisao;

    @ManyToOne
    @JoinColumn(name = "empresa", referencedColumnName = "cnpj")
    private Empresa empresa;
    private String periodoAvaliacao;

    @Column(unique = true)
    private String email;
    
    private String telefone;
    private String nomeresponsavel;
    private String telefoneresponsavel;
    private String observacoes;

    @Transient
    public String getNomeEmpresa() {
        return empresa != null ? empresa.getNomeEmpresa() : null;
    }

    // Getters e Setters
    public String getMatricula() { return matricula; }
    public void setMatricula(String matricula) { this.matricula = matricula; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public LocalDate getContratacao() { return contratacao; }
    public void setContratacao(LocalDate contratacao) { this.contratacao = contratacao; }

    public LocalDate getRescisao() { return rescisao; }
    public void setRescisao(LocalDate rescisao) { this.rescisao = rescisao; }

    public Empresa getEmpresa() { return empresa; }
    public void setEmpresa(Empresa empresa) { this.empresa = empresa; }

    public String getPeriodoAvaliacao() { return periodoAvaliacao; }
    public void setPeriodoAvaliacao(String periodoAvaliacao) { this.periodoAvaliacao = periodoAvaliacao; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getNomeresponsavel() { return nomeresponsavel; }
    public void setNomeresponsavel(String nomeresponsavel) { this.nomeresponsavel = nomeresponsavel; }

    public String getTelefoneresponsavel() { return telefoneresponsavel; }
    public void setTelefoneresponsavel(String telefoneresponsavel) { this.telefoneresponsavel = telefoneresponsavel; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}
