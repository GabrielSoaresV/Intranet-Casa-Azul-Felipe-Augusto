package com.controle.demandas.api.controller;

import com.controle.demandas.api.model.Demand;
import com.controle.demandas.api.model.Profile;
import com.controle.demandas.api.service.DemandService;
import com.controle.demandas.api.service.ProfileService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/demands")
public class DemandController {

    @Autowired
    private DemandService demandService;

    @Autowired
    private ProfileService profileService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Demand>> getAll() {
        return ResponseEntity.ok(demandService.listarTodas());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ATTENDANT')")
    public ResponseEntity<Demand> getById(@PathVariable String id) {
        return ResponseEntity.ok(demandService.buscarPorId(id));
    }

    @GetMapping("/creator/{cpf}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Demand>> getByCreator(@PathVariable String cpf) {
        return ResponseEntity.ok(demandService.buscarPorCriador(cpf));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> create(@RequestBody Demand demand) {
        Demand nova = demandService.criar(demand);
        Map<String, Object> body = Map.of(
            "message", "Demanda criada com sucesso.",
            "data", nova
        );
        return ResponseEntity.ok(body);
    }

    /** 🔹 Atualizar status de uma demanda (PATCH agora suportado) */
    @PatchMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Demand> updateStatus(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam(required = false) String notes
    ) {
        return ResponseEntity.ok(
            demandService.atualizarStatus(id, Demand.Status.valueOf(status))
        );
    }

    /** 🔹 Atribuir usuário a uma demanda */
    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ATTENDANT')")
    public ResponseEntity<Demand> assign(@PathVariable String id,
                                         @RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        Profile usuarioDesignado = profileService.getByCpf(userId);
        return ResponseEntity.ok(demandService.atribuirDemanda(id, usuarioDesignado));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Demand>> searchDemands(
        @RequestParam(required = false) String term,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String priority
    ) {
        List<Demand> results = demandService.searchDemands(term, status, priority);
        return ResponseEntity.ok(results);
    }

}
