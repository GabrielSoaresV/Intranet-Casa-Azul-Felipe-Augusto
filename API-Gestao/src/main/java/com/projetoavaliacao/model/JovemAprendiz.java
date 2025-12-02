package com.projetoavaliacao.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

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

    // =============================
    // RELAÇÃO COM AVALIAÇÕES
    // =============================
    @OneToMany(mappedBy = "jovem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Avaliacoes> avaliacoes;

    // Campo calculado
    @Transient
    private LocalDate ultimaAvaliacao;

    @Transient
    public String getNomeEmpresa() {
        return empresa != null ? empresa.getNomeEmpresa() : null;
    }

    // 🔥 Retorna automaticamente a última avaliação registrada
    @Transient
    public LocalDate getUltimaAvaliacao() {
        if (avaliacoes == null || avaliacoes.isEmpty())
            return null;

        return avaliacoes.stream()
                .map(Avaliacoes::getDataAvaliacao)
                .max(LocalDate::compareTo)
                .orElse(null);
    }


    // =============================
    // GETTERS E SETTERS COMPLETOS
    // =============================

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

    public List<Avaliacoes> getAvaliacoes() { return avaliacoes; }
    public void setAvaliacoes(List<Avaliacoes> avaliacoes) { this.avaliacoes = avaliacoes; }
}
