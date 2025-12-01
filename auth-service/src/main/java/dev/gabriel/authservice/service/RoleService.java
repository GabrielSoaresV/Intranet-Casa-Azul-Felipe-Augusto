package dev.gabriel.authservice.service;

import dev.gabriel.authservice.dto.RoleResponse;
import dev.gabriel.authservice.dto.RoleUpdateRequest;
import dev.gabriel.authservice.entity.Role;
import dev.gabriel.authservice.entity.User;
import dev.gabriel.authservice.repository.RoleRepository;
import dev.gabriel.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll()
                .stream()
                .map(role -> new RoleResponse(role.getId(), role.getName(), role.getDescription()))
                .toList();
    }

    public List<String> getUserRoles(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + username));

        return user.getRoles()
                .stream()
                .map(Role::getName)
                .toList();
    }

    public String addRoleToUser(String username, RoleUpdateRequest request) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + username));

        Role role = roleRepository.findByName(request.getRoleName())
                .orElseThrow(() -> new RuntimeException("Role não encontrada: " + request.getRoleName()));

        if (user.getRoles().contains(role)) {
            throw new RuntimeException("Usuário já possui essa role.");
        }

        user.getRoles().add(role);
        userRepository.save(user);

        return "Role adicionada com sucesso.";
    }

    public String removeRoleFromUser(String username, RoleUpdateRequest request) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + username));

        Role role = roleRepository.findByName(request.getRoleName())
                .orElseThrow(() -> new RuntimeException("Role não encontrada: " + request.getRoleName()));

        if (!user.getRoles().contains(role)) {
            throw new RuntimeException("Usuário não possui essa role.");
        }

        user.getRoles().remove(role);
        userRepository.save(user);

        return "Role removida com sucesso.";
    }
}
