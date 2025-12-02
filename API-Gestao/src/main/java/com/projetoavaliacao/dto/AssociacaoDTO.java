package com.projetoavaliacao.dto;

import java.time.LocalDate;

public class AssociacaoDTO {

    private Long id;
    private JovemDTO jovem;
    private AvaliacaoDTO avaliacao;

    // Getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public JovemDTO getJovem() { return jovem; }
    public void setJovem(JovemDTO jovem) { this.jovem = jovem; }

    public AvaliacaoDTO getAvaliacao() { return avaliacao; }
    public void setAvaliacao(AvaliacaoDTO avaliacao) { this.avaliacao = avaliacao; }

    // Classe interna JovemDTO
    public static class JovemDTO {
        private String matricula;
        private String nome;
        private String email;
        private String nomeEmpresa;
        private EmpresaDTO empresa;

        public String getMatricula() { return matricula; }
        public void setMatricula(String matricula) { this.matricula = matricula; }

        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getNomeEmpresa() { return nomeEmpresa; }
        public void setNomeEmpresa(String nomeEmpresa) { this.nomeEmpresa = nomeEmpresa; }

        public EmpresaDTO getEmpresa() { return empresa; }
        public void setEmpresa(EmpresaDTO empresa) { this.empresa = empresa; }
    }

    // Classe interna EmpresaDTO
    public static class EmpresaDTO {
        private String cnpj;
        private String rhNomeResponsavel;
        private String rhEmailResponsavel;

        public String getCnpj() { return cnpj; }
        public void setCnpj(String cnpj) { this.cnpj = cnpj; }

        public String getRhNomeResponsavel() { return rhNomeResponsavel; }
        public void setRhNomeResponsavel(String rhNomeResponsavel) { this.rhNomeResponsavel = rhNomeResponsavel; }

        public String getRhEmailResponsavel() { return rhEmailResponsavel; }
        public void setRhEmailResponsavel(String rhEmailResponsavel) { this.rhEmailResponsavel = rhEmailResponsavel; }
    }

    // Classe interna AvaliacaoDTO
    public static class AvaliacaoDTO {
        private Long idAvaliacao;
        private String avaliacao;
        private LocalDate dataAvaliacao;
        private Integer numeroAvaliacao;

        public Long getIdAvaliacao() { return idAvaliacao; }
        public void setIdAvaliacao(Long idAvaliacao) { this.idAvaliacao = idAvaliacao; }

        public String getAvaliacao() { return avaliacao; }
        public void setAvaliacao(String avaliacao) { this.avaliacao = avaliacao; }

        public LocalDate getDataAvaliacao() { return dataAvaliacao; }
        public void setDataAvaliacao(LocalDate dataAvaliacao) { this.dataAvaliacao = dataAvaliacao; }

        public Integer getNumeroAvaliacao() { return numeroAvaliacao; }
        public void setNumeroAvaliacao(Integer numeroAvaliacao) { this.numeroAvaliacao = numeroAvaliacao; }
    }
}
