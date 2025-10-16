package com.controle.demandas.api.controller;

import com.controle.demandas.api.model.Demand;
import com.controle.demandas.api.model.Profile;
import com.controle.demandas.api.service.DemandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/demands")
public class DemandController {

    @Autowired
    private DemandService demandService;

    @GetMapping
    public ResponseEntity<List<Demand>> getAll() {
        return ResponseEntity.ok(demandService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Demand> getById(@PathVariable String id) {
        return ResponseEntity.ok(demandService.buscarPorId(id));
    }

    @GetMapping("/citizen/{citizenId}")
    public ResponseEntity<List<Demand>> getByCitizen(@PathVariable String citizenId) {
        return ResponseEntity.ok(demandService.buscarPorCidadao(citizenId));
    }

    @PostMapping
    public ResponseEntity<Demand> create(@RequestBody Demand demand) {
        return ResponseEntity.ok(demandService.criar(demand));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Demand> updateStatus(@PathVariable String id,
                                               @RequestParam String status,
                                               @RequestParam(required = false) String notes) {
        // Converte string para enum antes de chamar o service
        return ResponseEntity.ok(demandService.atualizarStatus(id, Demand.Status.valueOf(status), notes));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<Demand> assign(@PathVariable String id,
                                        @RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        return ResponseEntity.ok(demandService.atribuirDemanda(id, userId));
    }
}
