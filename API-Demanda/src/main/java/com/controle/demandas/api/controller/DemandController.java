package com.controle.demandas.api.controller;

import com.controle.demandas.api.model.Demand;
import com.controle.demandas.api.service.DemandService;
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

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Demand>> getAll() {
        return ResponseEntity.ok(demandService.listarTodas());
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Demand> getById(@PathVariable String id) {
        return ResponseEntity.ok(demandService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or isAuthenticated()")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable String id) {
        demandService.deletarDemanda(id);
        return ResponseEntity.ok(Map.of(
            "message", "Demanda excluída com sucesso.",
            "id", id
        ));
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

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ATTENDANT')")
    public ResponseEntity<Demand> assign(@PathVariable String id) {
        return ResponseEntity.ok(demandService.atribuirDemanda(id));
    }

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Demand>> searchDemands(
        @RequestParam(required = false) String term,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String priority
    ) {
        List<Demand> results = demandService.searchDemands(term, status, priority);
        return ResponseEntity.ok(results);
    }

}
