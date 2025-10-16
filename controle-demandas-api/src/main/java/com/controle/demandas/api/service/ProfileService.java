package com.controle.demandas.api.service;

import com.controle.demandas.api.exception.NotFoundException;
import com.controle.demandas.api.model.Profile;
import com.controle.demandas.api.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    // Retorna o profile de um usuário pelo ID
    public Profile getCurrentProfile(String userId) {
        return profileRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Profile não encontrado"));
    }

    // Atualiza um profile
    public Profile updateProfile(String userId, Profile updates) {
        Profile profile = getCurrentProfile(userId);

        if (updates.getName() != null) profile.setName(updates.getName());
        if (updates.getEmail() != null) profile.setEmail(updates.getEmail());
        if (updates.getAvatarUrl() != null) profile.setAvatarUrl(updates.getAvatarUrl());
        if (updates.getRole() != null) profile.setRole(updates.getRole());

        profile.setUpdatedAt(java.time.Instant.now());

        return profileRepository.save(profile);
    }

    // Retorna todos os profiles
    public List<Profile> getAllProfiles() {
        return profileRepository.findAll();
    }


    public Profile criar(Profile profile) {
    // aqui você pode gerar um UUID ou receber do cliente
    if (profile.getId() == null) {
        profile.setId(UUID.randomUUID().toString());
    }
    profile.setCreatedAt(Instant.now());
    profile.setUpdatedAt(Instant.now());
    return profileRepository.save(profile);
}

}
