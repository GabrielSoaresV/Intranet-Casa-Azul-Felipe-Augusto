package com.projetoavaliacao.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "empresa")
public class Empresa {

    @Id
    private String cnpj;  // PK

    
    private String nomeEmpresa;
    private String emailEmpresa;
    private String telefoneEmpresa;
    private String rhNomeResponsavel;
    private String rhEmailResponsavel;

    // Getters e setters
    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    public String getNomeEmpresa() { return nomeEmpresa; }
    public void setNomeEmpresa(String nomeEmpresa) { this.nomeEmpresa = nomeEmpresa; }

    public String getEmailEmpresa() { return emailEmpresa; }
    public void setEmailEmpresa(String emailEmpresa) { this.emailEmpresa = emailEmpresa; }

    public String getTelefoneEmpresa() { return telefoneEmpresa; }
    public void setTelefoneEmpresa(String telefoneEmpresa) { this.telefoneEmpresa = telefoneEmpresa; }

    public String getRhNomeResponsavel() { return rhNomeResponsavel; }
    public void setRhNomeResponsavel(String rhNomeResponsavel) { this.rhNomeResponsavel = rhNomeResponsavel; }

    public String getRhEmailResponsavel() { return rhEmailResponsavel; }
    public void setRhEmailResponsavel(String rhEmailResponsavel) { this.rhEmailResponsavel = rhEmailResponsavel; }
}
