package com.projetoavaliacao.dto;

public record EmailRequest(
        String to,
        String subject,
        String body,
        String nomeJovem,
        String telefoneUsuario,
        String nomeUsuario
) {}
