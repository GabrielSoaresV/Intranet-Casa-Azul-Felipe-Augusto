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

    // Listar todos os cidadãos
    @GetMapping
    public ResponseEntity<List<Citizen>> listarTodos() {
        List<Citizen> citizens = citizenService.listarTodos();
        return ResponseEntity.ok(citizens);
    }

    // Buscar cidadão por ID
    @GetMapping("/{id}")
    public ResponseEntity<Citizen> buscarPorId(@PathVariable String id) {
        Citizen citizen = citizenService.buscarPorId(id);
        return ResponseEntity.ok(citizen);
    }

    // Criar novo cidadão
    @PostMapping
    public ResponseEntity<Citizen> criar(@RequestBody Citizen citizen) {
        Citizen criado = citizenService.criar(citizen);
        return ResponseEntity.ok(criado);
    }

    // Atualizar cidadão existente
    @PutMapping("/{id}")
    public ResponseEntity<Citizen> atualizar(@PathVariable String id, @RequestBody Citizen updates) {
        Citizen atualizado = citizenService.atualizar(id, updates);
        return ResponseEntity.ok(atualizado);
    }

    // Deletar cidadão
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        citizenService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
