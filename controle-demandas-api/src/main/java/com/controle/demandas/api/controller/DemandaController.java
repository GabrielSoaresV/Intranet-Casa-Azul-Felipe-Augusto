package com.controle.demandas.api.controller;

import com.controle.demandas.api.model.Demanda;
import com.controle.demandas.api.response.SuccessResponse;
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
    public ResponseEntity<SuccessResponse<Demanda>> criar(@Valid @RequestBody Demanda demanda) {
        Demanda salvo = demandaService.salvar(demanda);
        return ResponseEntity.ok(new SuccessResponse<>("Demanda criada com sucesso!", salvo));
    }

    @GetMapping
    public ResponseEntity<SuccessResponse<List<Demanda>>> listar() {
        List<Demanda> demandas = demandaService.listarTodos();
        return ResponseEntity.ok(new SuccessResponse<>("Lista de demandas recuperada com sucesso!", demandas));
    }

    @GetMapping("/cidadao/{cpf}")
    public ResponseEntity<SuccessResponse<List<Demanda>>> listarPorCidadao(@PathVariable String cpf) {
        List<Demanda> demandas = demandaService.listarPorCidadao(cpf);
        return ResponseEntity.ok(new SuccessResponse<>("Demandas do cidadão recuperadas com sucesso!", demandas));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<SuccessResponse<Demanda>> alterarStatus(@PathVariable Long id, @RequestParam String status) {
        Demanda atualizado = demandaService.alterarStatus(id, status);
        return ResponseEntity.ok(new SuccessResponse<>("Status da demanda alterado com sucesso!", atualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<SuccessResponse<Void>> excluir(@PathVariable Long id) {
        demandaService.excluir(id);
        return ResponseEntity.ok(new SuccessResponse<>("Demanda excluída com sucesso!", null));
    }
}
