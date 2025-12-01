package dev.gabriel.authservice.dto;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String username;
    private String email;
    private String cpf;
}
