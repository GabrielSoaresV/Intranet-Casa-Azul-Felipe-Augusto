package dev.gabriel.authservice.controller;

import dev.gabriel.authservice.dto.RoleResponse;
import dev.gabriel.authservice.dto.RoleUpdateRequest;
import dev.gabriel.authservice.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public List<RoleResponse> getAllRoles() {
        return roleService.getAllRoles();
    }

    @GetMapping("/{username}")
    public List<String> getUserRoles(@PathVariable String username) {
        return roleService.getUserRoles(username);
    }

    @PostMapping("/{username}/add")
    public String addRole(
            @PathVariable String username,
            @RequestBody RoleUpdateRequest request
    ) {
        return roleService.addRoleToUser(username, request);
    }

    @PostMapping("/{username}/remove")
    public String removeRole(
            @PathVariable String username,
            @RequestBody RoleUpdateRequest request
    ) {
        return roleService.removeRoleFromUser(username, request);
    }
}
