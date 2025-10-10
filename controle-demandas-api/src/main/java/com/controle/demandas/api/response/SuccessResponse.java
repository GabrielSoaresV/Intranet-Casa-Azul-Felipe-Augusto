package com.controle.demandas.api.response;

public class SuccessResponse<T> {
    private String message;
    private T data;

    public SuccessResponse(String message, T data) {
        this.message = message;
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public T getData() {
        return data;
    }
}
