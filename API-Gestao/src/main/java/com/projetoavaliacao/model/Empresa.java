package com.projetoavaliacao.model;

import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "empresa")
public class Empresa {

    @Id
    private String cnpj;  // PK

    @Column(nullable = false)
    private String nomeEmpresa;

    // Agora é uma lista de e-mails
    @ElementCollection
    @CollectionTable(
            name = "empresa_emails",
            joinColumns = @JoinColumn(name = "empresa_cnpj")
    )
    @Column(name = "email", nullable = false)
    private List<String> emailEmpresa;

    private String telefoneEmpresa;
    private String rhNomeResponsavel;
    private String rhEmailResponsavel;

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    public String getNomeEmpresa() { return nomeEmpresa; }
    public void setNomeEmpresa(String nomeEmpresa) { this.nomeEmpresa = nomeEmpresa; }

    public List<String> getEmailEmpresa() { return emailEmpresa; }
    public void setEmailEmpresa(List<String> emailEmpresa) { this.emailEmpresa = emailEmpresa; }

    public String getTelefoneEmpresa() { return telefoneEmpresa; }
    public void setTelefoneEmpresa(String telefoneEmpresa) { this.telefoneEmpresa = telefoneEmpresa; }

    public String getRhNomeResponsavel() { return rhNomeResponsavel; }
    public void setRhNomeResponsavel(String rhNomeResponsavel) { this.rhNomeResponsavel = rhNomeResponsavel; }

    public String getRhEmailResponsavel() { return rhEmailResponsavel; }
    public void setRhEmailResponsavel(String rhEmailResponsavel) { this.rhEmailResponsavel = rhEmailResponsavel; }
}
