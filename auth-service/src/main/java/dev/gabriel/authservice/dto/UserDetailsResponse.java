package dev.gabriel.authservice.dto;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDetailsResponse {

    private Long id;
    private String username;
    private String cpf;
    private String email;
    private String profileImage;
    private boolean enabled;
    private Set<String> roles;
}
