package com.controle.demandas.api.controller;

import com.controle.demandas.api.model.Profile;
import com.controle.demandas.api.security.JwtUtil;
import com.controle.demandas.api.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.io.IOException;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private JwtUtil jwtUtil;

    private String getLoggedInCpf() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuário não autenticado.");
        }
        return authentication.getName();
    }

    private ResponseEntity<Map<String, Object>> response(String message, Object data) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", message);
        body.put("data", data);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String login = credentials.get("login");
        String password = credentials.get("password");

        if (login == null || password == null) {
            throw new IllegalArgumentException("Campos 'login' e 'password' são obrigatórios.");
        }

        Profile profile = profileService.authenticate(login, password);
        String token = jwtUtil.generateToken(profile.getCpf(), profile.getRole().name());

        Map<String, Object> data = Map.of(
                "token", token,
                "role", profile.getRole()
        );

        return response("Login realizado com sucesso.", data);
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getCurrentProfile() {
        String cpf = getLoggedInCpf();
        Profile profile = profileService.getByCpf(cpf);
        return response("Perfil obtido com sucesso.", profile);
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> updateCurrentProfile(@RequestBody Profile updates) {
        String cpf = getLoggedInCpf();
        Profile updated = profileService.update(cpf, updates);
        return response("Perfil atualizado com sucesso.", updated);
    }

    @PostMapping("/public-register")
    @CrossOrigin(origins = "*")
    public ResponseEntity<Map<String, Object>> publicRegister(@RequestBody Profile profile) {
        profile.setRole(Profile.Role.CITIZEN);
        Profile created = profileService.createPublicProfile(profile);
        URI uri = URI.create("/api/profiles/" + created.getCpf());
        return ResponseEntity.created(uri)
                .body(Map.of("message", "Perfil público criado com sucesso.", "data", created));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> create(@RequestBody Profile profile) {
        Profile created = profileService.create(profile);
        URI uri = URI.create("/api/profiles/" + created.getCpf());
        return ResponseEntity.created(uri)
                .body(Map.of("message", "Perfil criado com sucesso.", "data", created));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAll() {
        List<Profile> profiles = profileService.getAll();
        return response("Perfis listados com sucesso.", profiles);
    }

    @GetMapping("/{cpf}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getByCpf(@PathVariable String cpf) {
        Profile profile = profileService.getByCpf(cpf);
        return response("Perfil encontrado.", profile);
    }

    @DeleteMapping("/{cpf}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable String cpf) {
        profileService.delete(cpf);
        return response("Perfil deletado com sucesso.", null);
    }

    @PostMapping("/me/avatar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> uploadAvatar(@RequestParam("file") MultipartFile file) throws IOException {
        String cpf = getLoggedInCpf();
        Profile profile = profileService.getByCpf(cpf);

        if (file.isEmpty()) {
            throw new IllegalArgumentException("Nenhum arquivo enviado.");
        }

        byte[] bytes = file.getBytes();
        profile.setAvatar(bytes);
        profile.setUpdatedAt(Instant.now());
        Profile updated = profileService.update(cpf, profile);

        return response("Avatar atualizado com sucesso!", updated);
    }

    @GetMapping("/me/avatar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<byte[]> getMyAvatar() {
        String cpf = getLoggedInCpf();
        Profile profile = profileService.getByCpf(cpf);

        if (profile.getAvatar() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity
                .ok()
                .contentType(org.springframework.http.MediaType.IMAGE_JPEG)
                .body(profile.getAvatar());
    }
}
