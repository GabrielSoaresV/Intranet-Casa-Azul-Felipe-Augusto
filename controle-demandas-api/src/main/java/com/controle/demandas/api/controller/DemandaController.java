package com.controle.demandas.api.controller;

import com.controle.demandas.api.model.Demanda;
import com.controle.demandas.api.response.ApiResponse;
import com.controle.demandas.api.service.DemandaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/demandas")
public class DemandaController {

    @Autowired
    private DemandaService demandaService;

    @PostMapping
    public ResponseEntity<ApiResponse<Demanda>> criar(@RequestBody Demanda demanda) {
        return ResponseEntity.ok(demandaService.salvar(demanda));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Demanda>>> listar() {
        return ResponseEntity.ok(demandaService.listarTodos());
    }

    @GetMapping("/cidadao/{cpf}")
    public ResponseEntity<ApiResponse<List<Demanda>>> listarPorCidadao(@PathVariable String cpf) {
        return ResponseEntity.ok(demandaService.listarPorCidadao(cpf));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Demanda>> alterarStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(demandaService.alterarStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> excluir(@PathVariable Long id) {
        return ResponseEntity.ok(demandaService.excluir(id));
    }
}
