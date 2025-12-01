package dev.gabriel.authservice.dto;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String username;
    private String cpf;
    private String email;
    private String profileImage;
    private Set<String> roles;
}
