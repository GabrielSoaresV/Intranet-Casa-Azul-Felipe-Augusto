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
    @PreAuthorize("hasRole('ATTENDANT')")
    public ResponseEntity<List<Demand>> getAll() {
        return ResponseEntity.ok(demandService.listarTodas());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ATTENDANT')")
    public ResponseEntity<Demand> getById(@PathVariable String id) {
        return ResponseEntity.ok(demandService.buscarPorId(id));
    }

    @GetMapping("/creator/{cpf}")
    @PreAuthorize("hasRole('ATTENDANT')")
    public ResponseEntity<List<Demand>> getByCreator(@PathVariable String cpf) {
        return ResponseEntity.ok(demandService.buscarPorCriador(cpf));
    }

    @PostMapping
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<Map<String, Object>> create(@RequestBody Demand demand) {
        Demand nova = demandService.criar(demand);
        Map<String, Object> body = Map.of(
            "message", "Demanda criada com sucesso.",
            "data", nova
        );
        return ResponseEntity.ok(body);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ATTENDANT')")
    public ResponseEntity<Demand> updateStatus(@PathVariable String id,
                                            @RequestParam String status) {
        // Remove o 'notes', porque o service não recebe mais
        return ResponseEntity.ok(demandService.atualizarStatus(id, Demand.Status.valueOf(status)));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Demand> assign(@PathVariable String id,
                                         @RequestBody Map<String, String> body) {
        String userId = body.get("userId");

        // ✅ usa o método getByCpf do ProfileService
        Profile usuarioDesignado = profileService.getByCpf(userId);
        return ResponseEntity.ok(demandService.atribuirDemanda(id, usuarioDesignado));
    }
}
