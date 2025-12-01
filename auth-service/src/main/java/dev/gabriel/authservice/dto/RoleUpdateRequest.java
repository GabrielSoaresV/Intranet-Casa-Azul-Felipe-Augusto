package dev.gabriel.authservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoleUpdateRequest {
    private String roleName; // ex: ROLE_ADMIN
}
