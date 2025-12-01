package dev.gabriel.authservice.config;

import dev.gabriel.authservice.entity.Role;
import dev.gabriel.authservice.entity.User;
import dev.gabriel.authservice.repository.RoleRepository;
import dev.gabriel.authservice.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {

        // ======================
        // SEED DE ROLES
        // ======================
        createRole("ROLE_ADMIN", "Administrador do sistema");
        createRole("ROLE_USER", "Usuário padrão");

        // ======================
        // SEED DE USUÁRIO ADMIN
        // ======================
        createAdminUser();
    }

    private void createRole(String name, String description) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = Role.builder()
                    .name(name)
                    .description(description)
                    .build();
            roleRepository.save(role);
            System.out.println("✔ Role criada: " + name);
        }
    }

    private void createAdminUser() {

        // já existe um admin?
        boolean adminExists = userRepository.findByUsername("admin").isPresent();

        if (!adminExists) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN não foi encontrada!"));

            User admin = User.builder()
                    .username("admin")
                    .cpf("07700870190")
                    .email("soaresgabrielvinicius@gmail.com")
                    .password(passwordEncoder.encode("admin123"))  // senha padrão
                    .enabled(true)
                    .build();

            admin.getRoles().add(adminRole);
            userRepository.save(admin);

            System.out.println("✔ Usuário ADMIN criado automaticamente: admin / admin123");
        } else {
            System.out.println("✔ Usuário ADMIN já existe — seed ignorado");
        }
    }
}
