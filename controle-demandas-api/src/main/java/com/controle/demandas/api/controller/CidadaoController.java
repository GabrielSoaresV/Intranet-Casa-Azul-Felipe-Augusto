package com.controle.demandas.api.controller;

import com.controle.demandas.api.model.Cidadao;
import com.controle.demandas.api.response.SuccessResponse;
import com.controle.demandas.api.service.CidadaoService;
import jakarta.validation.Valid;
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
    public ResponseEntity<SuccessResponse<Cidadao>> criar(@Valid @RequestBody Cidadao cidadao) {
        Cidadao salvo = cidadaoService.salvar(cidadao);
        return ResponseEntity.ok(new SuccessResponse<>("Cidadão cadastrado com sucesso!", salvo));
    }

    @GetMapping
    public ResponseEntity<SuccessResponse<List<Cidadao>>> listar() {
        List<Cidadao> cidadaos = cidadaoService.listarTodos();
        return ResponseEntity.ok(new SuccessResponse<>("Lista de cidadãos recuperada com sucesso!", cidadaos));
    }

    @GetMapping("/{cpf}")
    public ResponseEntity<SuccessResponse<Cidadao>> buscar(@PathVariable String cpf) {
        Cidadao cidadao = cidadaoService.buscarPorCpf(cpf);
        return ResponseEntity.ok(new SuccessResponse<>("Cidadão encontrado com sucesso!", cidadao));
    }

    @DeleteMapping("/{cpf}")
    public ResponseEntity<SuccessResponse<Void>> excluir(@PathVariable String cpf) {
        cidadaoService.excluir(cpf);
        return ResponseEntity.ok(new SuccessResponse<>("Cidadão excluído com sucesso!", null));
    }
}
