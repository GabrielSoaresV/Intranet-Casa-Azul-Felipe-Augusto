package com.controle.demandas.api.exception;

public class CidadaoException {

    public static class CidadaoNotFoundException extends RuntimeException {
        public CidadaoNotFoundException(String message) {
            super(message);
        }
    }

    public static class CidadaoDuplicatedException extends RuntimeException {
        public CidadaoDuplicatedException(String message) {
            super(message);
        }
    }

    public static class CidadaoUnauthorizedException extends RuntimeException {
        public CidadaoUnauthorizedException(String message) {
            super(message);
        }
    }

    public static class CidadaoForbiddenException extends RuntimeException {
        public CidadaoForbiddenException(String message) {
            super(message);
        }
    }
}
