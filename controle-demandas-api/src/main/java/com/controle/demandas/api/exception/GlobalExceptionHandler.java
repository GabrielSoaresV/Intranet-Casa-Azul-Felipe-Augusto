package com.controle.demandas.api.exception;

import com.controle.demandas.api.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        StringBuilder errors = new StringBuilder();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.append(error.getField())
                  .append(": ")
                  .append(error.getDefaultMessage())
                  .append("; ");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(HttpStatus.BAD_REQUEST.value(), errors.toString()));
    }

    @ExceptionHandler(CidadaoException.CidadaoNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleCidadaoNotFound(CidadaoException.CidadaoNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(HttpStatus.NOT_FOUND.value(), ex.getMessage()));
    }

    @ExceptionHandler(CidadaoException.CidadaoDuplicatedException.class)
    public ResponseEntity<ApiResponse<Void>> handleCidadaoDuplicated(CidadaoException.CidadaoDuplicatedException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(HttpStatus.CONFLICT.value(), ex.getMessage()));
    }

    @ExceptionHandler(CidadaoException.CidadaoUnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handleCidadaoUnauthorized(CidadaoException.CidadaoUnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(HttpStatus.UNAUTHORIZED.value(), ex.getMessage()));
    }

    @ExceptionHandler(CidadaoException.CidadaoForbiddenException.class)
    public ResponseEntity<ApiResponse<Void>> handleCidadaoForbidden(CidadaoException.CidadaoForbiddenException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error(HttpStatus.FORBIDDEN.value(), ex.getMessage()));
    }

    @ExceptionHandler(DemandaException.DemandaNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleDemandaNotFound(DemandaException.DemandaNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(HttpStatus.NOT_FOUND.value(), ex.getMessage()));
    }

    @ExceptionHandler(DemandaException.DemandaDuplicatedException.class)
    public ResponseEntity<ApiResponse<Void>> handleDemandaDuplicated(DemandaException.DemandaDuplicatedException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(HttpStatus.CONFLICT.value(), ex.getMessage()));
    }

    @ExceptionHandler(DemandaException.DemandaUnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handleDemandaUnauthorized(DemandaException.DemandaUnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(HttpStatus.UNAUTHORIZED.value(), ex.getMessage()));
    }

    @ExceptionHandler(DemandaException.DemandaForbiddenException.class)
    public ResponseEntity<ApiResponse<Void>> handleDemandaForbidden(DemandaException.DemandaForbiddenException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error(HttpStatus.FORBIDDEN.value(), ex.getMessage()));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleResponseStatus(ResponseStatusException ex) {
        int status = ex.getStatusCode().value();
        String message = ex.getReason() != null ? ex.getReason() : "Erro inesperado";
        return ResponseEntity.status(status)
                .body(ApiResponse.error(status, message));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        "Erro interno do servidor: " + ex.getMessage()));
    }
}
