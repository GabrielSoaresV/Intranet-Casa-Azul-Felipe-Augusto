package com.projetoavaliacao.dto;

import java.util.List;

public class EmailJovemDTO {

    private String nomeJovem;
    private String telefoneUsuario;
    private String nomeUsuario;
    private String nomeOrientador;
    private List<String> emailsDestino;

    public EmailJovemDTO(String nomeJovem, String telefoneUsuario, String nomeUsuario,
                         String nomeOrientador, List<String> emailsDestino) {
        this.nomeJovem = nomeJovem;
        this.telefoneUsuario = telefoneUsuario;
        this.nomeUsuario = nomeUsuario;
        this.nomeOrientador = nomeOrientador;
        this.emailsDestino = emailsDestino;
    }

    public String getNomeJovem() { return nomeJovem; }
    public String getTelefoneUsuario() { return telefoneUsuario; }
    public String getNomeUsuario() { return nomeUsuario; }
    public String getNomeOrientador() { return nomeOrientador; }
    public List<String> getEmailsDestino() { return emailsDestino; }
}
