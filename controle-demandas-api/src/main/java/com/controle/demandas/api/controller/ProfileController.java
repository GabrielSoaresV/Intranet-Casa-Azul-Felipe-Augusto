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

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "*") // Apenas para teste
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private JwtUtil jwtUtil;

    /** 🔹 Retorna CPF do usuário logado */
    private String getLoggedInCpf() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuário não autenticado.");
        }
        return authentication.getName();
    }

    /** 🔹 Helper para respostas padronizadas */
    private ResponseEntity<Map<String, Object>> response(String message, Object data) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", message);
        body.put("data", data);
        return ResponseEntity.ok(body);
    }

    /** 🔹 Login - retorna JWT e role */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String login = credentials.get("login"); // CPF ou email
        String password = credentials.get("password");

        Profile profile = profileService.authenticate(login, password);

        String token = jwtUtil.generateToken(profile.getCpf(), profile.getRole().name());
        Map<String, Object> data = Map.of(
                "token", token,
                "role", profile.getRole()
        );
        return response("Login realizado com sucesso.", data);
    }

    /** 🔹 Obter perfil do usuário logado */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentProfile() {
        String cpf = getLoggedInCpf();
        Profile profile = profileService.getByCpf(cpf);
        return response("Perfil obtido com sucesso.", profile);
    }

    /** 🔹 Atualizar perfil do usuário logado */
    @PutMapping("/me")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateCurrentProfile(@RequestBody Profile updates) {
        String cpf = getLoggedInCpf();
        Profile updated = profileService.update(cpf, updates);
        return response("Perfil atualizado com sucesso.", updated);
    }

    /** 🔹 Criar novo perfil (somente ADMIN) */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> create(@RequestBody Profile profile) {
        Profile created = profileService.create(profile);
        URI uri = URI.create("/api/profiles/" + created.getCpf());
        Map<String, Object> body = Map.of(
                "message", "Perfil criado com sucesso.",
                "data", created
        );
        return ResponseEntity.created(uri).body(body);
    }

    /** 🔹 Listar todos os perfis (somente ADMIN) */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAll() {
        List<Profile> profiles = profileService.getAll();
        return response("Perfis listados com sucesso.", profiles);
    }

    /** 🔹 Buscar perfil por CPF (somente ADMIN) */
    @GetMapping("/{cpf}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getByCpf(@PathVariable String cpf) {
        Profile profile = profileService.getByCpf(cpf);
        return response("Perfil encontrado.", profile);
    }

    /** 🔹 Deletar perfil por CPF (somente ADMIN) */
    @DeleteMapping("/{cpf}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable String cpf) {
        profileService.delete(cpf);
        return response("Perfil deletado com sucesso.", null);
    }
}
