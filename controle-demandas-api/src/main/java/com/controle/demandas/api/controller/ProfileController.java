package com.controle.demandas.api.controller;

import com.controle.demandas.api.model.Profile;
import com.controle.demandas.api.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    // Helper para pegar o userId do usuário logado
    private String getLoggedInUserId() {
        // Aqui você implementa a lógica para pegar o ID do usuário logado
        // Exemplo: a partir de um token JWT
        return "user-id-exemplo"; 
    }

    @GetMapping("/me")
    public ResponseEntity<Profile> getCurrent() {
        String userId = getLoggedInUserId();
        return ResponseEntity.ok(profileService.getCurrentProfile(userId));
    }

    @PutMapping("/me")
    public ResponseEntity<Profile> updateCurrent(@RequestBody Profile updates) {
        String userId = getLoggedInUserId();
        return ResponseEntity.ok(profileService.updateProfile(userId, updates));
    }

    @GetMapping
    public ResponseEntity<List<Profile>> getAll() {
        return ResponseEntity.ok(profileService.getAllProfiles());
    }

    @PostMapping
    public ResponseEntity<Profile> create(@RequestBody Profile profile) {
        return ResponseEntity.ok(profileService.criar(profile));
    }

}
