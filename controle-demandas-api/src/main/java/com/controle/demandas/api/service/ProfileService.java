package com.controle.demandas.api.service;

import com.controle.demandas.api.exception.NotFoundException;
import com.controle.demandas.api.model.Profile;
import com.controle.demandas.api.model.Profile.Role;
import com.controle.demandas.api.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

        // Criptografa senha
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
        if (updates.getAvatarUrl() != null) existing.setAvatarUrl(updates.getAvatarUrl());

        if (updates.getRole() != null) {
            validateRole(updates.getRole());
            existing.setRole(updates.getRole());
        }

        if (updates.getPassword() != null && !updates.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(updates.getPassword()));
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
}
