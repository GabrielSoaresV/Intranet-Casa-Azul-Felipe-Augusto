package com.controle.demandas.api.exception;

public class DemandaException {

    public static class DemandaDuplicatedException extends RuntimeException {
        public DemandaDuplicatedException(String message) {
            super(message);
        }
    }

    public static class DemandaForbiddenException extends RuntimeException {
        public DemandaForbiddenException(String message) {
            super(message);
        }
    }
    public static class DemandaUnauthorizedException extends RuntimeException {
        public DemandaUnauthorizedException(String message) {
            super(message);
        }
    }
}
