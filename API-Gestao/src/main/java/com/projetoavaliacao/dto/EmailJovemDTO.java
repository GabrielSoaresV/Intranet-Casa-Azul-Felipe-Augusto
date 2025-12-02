package com.projetoavaliacao.dto;

public class EmailJovemDTO {
    private String nomeJovem;       
    private String telefoneUsuario;   
    private String nomeUsuario;     
    private String nomeOrientador;  
    private String emailDestino;    

    public EmailJovemDTO(String nomeJovem, String telefoneUsuario, String nomeUsuario, String nomeOrientador, String emailDestino) {
        this.nomeJovem = nomeJovem;
        this.telefoneUsuario = telefoneUsuario;
        this.nomeUsuario = nomeUsuario;
        this.nomeOrientador = nomeOrientador;
        this.emailDestino = emailDestino;
    }

    public String getNomeJovem() { return nomeJovem; }
    public String getTelefoneUsuario() { return telefoneUsuario; }
    public String getNomeUsuario() { return nomeUsuario; }
    public String getNomeOrientador() { return nomeOrientador; }
    public String getEmailDestino() { return emailDestino; }
}
