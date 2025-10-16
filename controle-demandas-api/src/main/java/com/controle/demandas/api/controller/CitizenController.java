package com.controle.demandas.api.controller;

import com.controle.demandas.api.model.Citizen;
import com.controle.demandas.api.service.CitizenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citizens")
public class CitizenController {

    @Autowired
    private CitizenService citizenService;

    @GetMapping
    public ResponseEntity<List<Citizen>> getAll() {
        return ResponseEntity.ok(citizenService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Citizen> getById(@PathVariable String id) {
        return ResponseEntity.ok(citizenService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Citizen> create(@RequestBody Citizen citizen) {
        return ResponseEntity.ok(citizenService.criar(citizen));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Citizen> update(@PathVariable String id, @RequestBody Citizen updates) {
        return ResponseEntity.ok(citizenService.atualizar(id, updates));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        citizenService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
