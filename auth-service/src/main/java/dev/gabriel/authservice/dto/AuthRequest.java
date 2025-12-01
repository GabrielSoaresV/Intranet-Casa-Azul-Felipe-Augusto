package dev.gabriel.authservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthRequest {

    @NotBlank(message = "O campo userlogin é obrigatório.")
    private String userlogin;

    @NotBlank(message = "A senha é obrigatória.")
    private String password;
}
