package com.controle.demandas.api.controller;

import com.controle.demandas.api.model.Cidadao;
import com.controle.demandas.api.response.ApiResponse;
import com.controle.demandas.api.service.CidadaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cidadaos")
public class CidadaoController {

    @Autowired
    private CidadaoService cidadaoService;

    @PostMapping
    public ResponseEntity<ApiResponse<Cidadao>> criar(@RequestBody Cidadao cidadao) {
        return ResponseEntity.ok(cidadaoService.salvar(cidadao));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Cidadao>>> listar() {
        return ResponseEntity.ok(cidadaoService.listarTodos());
    }

    @GetMapping("/{cpf}")
    public ResponseEntity<ApiResponse<Cidadao>> buscar(@PathVariable String cpf) {
        return ResponseEntity.ok(cidadaoService.buscarPorCpf(cpf));
    }

    @DeleteMapping("/{cpf}")
    public ResponseEntity<ApiResponse<Void>> excluir(@PathVariable String cpf) {
        return ResponseEntity.ok(cidadaoService.excluir(cpf));
    }
}
