package com.controle.demandas.api.exception;

public class NotFound extends RuntimeException {
    public NotFound(String mensagem) {
        super(mensagem);
    }
}
