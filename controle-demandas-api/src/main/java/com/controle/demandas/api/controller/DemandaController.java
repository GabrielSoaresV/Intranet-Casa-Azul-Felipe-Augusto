package com.controle.demandas.api.controller;

import com.controle.demandas.api.model.Demanda;
import com.controle.demandas.api.response.ApiResponse;
import com.controle.demandas.api.service.DemandaService;
import jakarta.validation.Valid;
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
    public ResponseEntity<ApiResponse<Demanda>> criar(@Valid @RequestBody Demanda demanda) {
        Demanda salvo = demandaService.salvar(demanda);
        return ResponseEntity.status(201).body(ApiResponse.created("Demanda criada com sucesso!", salvo));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Demanda>>> listar() {
        return ResponseEntity.ok(ApiResponse.success("Lista de demandas recuperada com sucesso!", demandaService.listarTodos()));
    }

    @GetMapping("/cidadao/{cpf}")
    public ResponseEntity<ApiResponse<List<Demanda>>> listarPorCidadao(@PathVariable String cpf) {
        return ResponseEntity.ok(ApiResponse.success("Demandas do cidadão recuperadas com sucesso!", demandaService.listarPorCidadao(cpf)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Demanda>> alterarStatus(@PathVariable Long id, @RequestParam String status) {
        Demanda atualizado = demandaService.alterarStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Status da demanda alterado com sucesso!", atualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> excluir(@PathVariable Long id) {
        demandaService.excluir(id);
        return ResponseEntity.ok(ApiResponse.success("Demanda excluída com sucesso!", null));
    }
}
