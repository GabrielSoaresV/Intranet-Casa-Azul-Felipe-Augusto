package com.controle.demandas.api.service;

import com.controle.demandas.api.exception.NotFoundException;
import com.controle.demandas.api.model.Profile;
import com.controle.demandas.api.model.Profile.Role;
import com.controle.demandas.api.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.time.Instant;
import java.util.List;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // -------------------- CRUD --------------------

    /** Cria um novo perfil */
    public Profile create(Profile profile) {
        validateProfileForCreation(profile);

        // Criptografa senha ao criar novo usuário
        profile.setPassword(passwordEncoder.encode(profile.getPassword()));

        Instant now = Instant.now();
        profile.setCreatedAt(now);
        profile.setUpdatedAt(now);

        return profileRepository.save(profile);
    }

    /** Atualiza um perfil existente */
    public Profile update(String cpf, Profile updates) {
        Profile existing = getByCpf(cpf);

        if (updates.getName() != null) existing.setName(updates.getName());

        if (updates.getEmail() != null && !updates.getEmail().equals(existing.getEmail())) {
            if (profileRepository.existsByEmail(updates.getEmail())) {
                throw new IllegalArgumentException("Já existe um perfil com este e-mail.");
            }
            existing.setEmail(updates.getEmail());
        }

        if (updates.getPhone() != null) existing.setPhone(updates.getPhone());
        if (updates.getAvatar() != null) existing.setAvatar(updates.getAvatar());

        if (updates.getRole() != null) {
            validateRole(updates.getRole());
            existing.setRole(updates.getRole());
        }

        // ✅ Corrigido: evita recriptografar senhas já criptografadas
        if (updates.getPassword() != null && !updates.getPassword().isBlank()) {
            String newPass = updates.getPassword();

            // Se a senha não estiver criptografada, criptografa
            if (!newPass.startsWith("$2a$")) {
                existing.setPassword(passwordEncoder.encode(newPass));
            } else {
                // Caso já seja hash, mantém o valor
                existing.setPassword(newPass);
            }
        }

        existing.setUpdatedAt(Instant.now());
        return profileRepository.save(existing);
    }

    /** Autenticação (login) */
    public Profile authenticate(String login, String rawPassword) {
        Profile profile = profileRepository.findByCpfOrEmail(login, login)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        if (!passwordEncoder.matches(rawPassword, profile.getPassword())) {
            throw new IllegalArgumentException("CPF ou senha incorretos.");
        }

        return profile;
    }

    /** Deleta um perfil */
    public void delete(String cpf) {
        if (!profileRepository.existsById(cpf)) {
            throw new NotFoundException("Perfil não encontrado para CPF: " + cpf);
        }
        profileRepository.deleteById(cpf);
    }

    /** Lista todos os perfis */
    public List<Profile> getAll() {
        return profileRepository.findAll();
    }

    /** Busca por CPF */
    public Profile getByCpf(String cpf) {
        return profileRepository.findById(cpf)
                .orElseThrow(() -> new NotFoundException("Perfil não encontrado para CPF: " + cpf));
    }

    // -------------------- MÉTODOS AUXILIARES --------------------

    /** Valida dados obrigatórios para criação */
    private void validateProfileForCreation(Profile profile) {
        if (profile.getCpf() == null || !profile.getCpf().matches("\\d{11}")) {
            throw new IllegalArgumentException("CPF inválido. Deve conter 11 dígitos numéricos.");
        }

        validateRole(profile.getRole());

        if (profileRepository.existsById(profile.getCpf())) {
            throw new IllegalArgumentException("Já existe um perfil com este CPF.");
        }

        if (profileRepository.existsByEmail(profile.getEmail())) {
            throw new IllegalArgumentException("Já existe um perfil com este e-mail.");
        }
    }

    /** Valida role */
    private void validateRole(Role role) {
        if (role == null) {
            throw new IllegalArgumentException("Role obrigatória. Use ADMIN, ATTENDANT ou CITIZEN.");
        }
    }

    @PostConstruct
    public void createDefaultAdmin() {
        String cpf = "00000000001";
        String email = "admin@teste.com";

        if (profileRepository.existsById(cpf)) {
            System.out.println("✅ Usuário admin já existe. Pulando criação automática.");
            return;
        }

        Profile admin = new Profile();
        admin.setCpf(cpf);
        admin.setName("Administrador");
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode("123456"));
        admin.setRole(Profile.Role.ADMIN);
        admin.setCreatedAt(Instant.now());
        admin.setUpdatedAt(Instant.now());

        profileRepository.save(admin);
        System.out.println("🚀 Usuário admin criado com sucesso: " + email + " / senha: 123456");
    }

    @PostConstruct
    public void createDefaultAttendent() {
        String cpf = "00000000002";
        String email = "atendente@teste.com";

        if (profileRepository.existsById(cpf)) {
            System.out.println("✅ Usuário atendente já existe. Pulando criação automática.");
            return;
        }

        Profile atendente = new Profile();
        atendente.setCpf(cpf);
        atendente.setName("Atendente");
        atendente.setEmail(email);
        atendente.setPassword(passwordEncoder.encode("123456"));
        atendente.setRole(Profile.Role.ATTENDANT);
        atendente.setCreatedAt(Instant.now());
        atendente.setUpdatedAt(Instant.now());

        profileRepository.save(atendente);
        System.out.println("🚀 Usuário Atendente criado com sucesso: " + email + " / senha: 123456");
    }

    @PostConstruct
    public void createDefaultCitizen() {
        String cpf = "00000000003";
        String email = "cidadao@teste.com";

        if (profileRepository.existsById(cpf)) {
            System.out.println("✅ Usuário cidadão já existe. Pulando criação automática.");
            return;
        }

        Profile cidadao = new Profile();
        cidadao.setCpf(cpf);
        cidadao.setName("Cidadão");
        cidadao.setEmail(email);
        cidadao.setPassword(passwordEncoder.encode("123456"));
        cidadao.setRole(Profile.Role.CITIZEN);
        cidadao.setCreatedAt(Instant.now());
        cidadao.setUpdatedAt(Instant.now());

        profileRepository.save(cidadao);
        System.out.println("🚀 Usuário Cidadão criado com sucesso: " + email + " / senha: 123456");
    }
}
