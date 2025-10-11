package com.controle.demandas.api.controller;

import com.controle.demandas.api.dto.CidadaoCreateDTO;
import com.controle.demandas.api.model.Cidadao;
import com.controle.demandas.api.response.ApiResponse;
import com.controle.demandas.api.service.CidadaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cidadaos")
@CrossOrigin(origins = "http://localhost:4200")
public class CidadaoController {

    @Autowired
    private CidadaoService cidadaoService;

    @PostMapping
    public ResponseEntity<ApiResponse<Cidadao>> criar(@Valid @RequestBody CidadaoCreateDTO dto) {
        return cidadaoService.criar(dto);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Cidadao>>> listar() {
        return cidadaoService.listarTodosCidadaos();
    }

    @GetMapping("/{cpf}")
    public ResponseEntity<ApiResponse<Cidadao>> buscar(@PathVariable String cpf) {
        return cidadaoService.buscarPorCpfResponse(cpf);
    }

    @DeleteMapping("/{cpf}")
    public ResponseEntity<ApiResponse<Void>> excluir(@PathVariable String cpf) {
        return cidadaoService.excluirCidadao(cpf);
    }

    @PutMapping("/{cpf}")
    public ResponseEntity<ApiResponse<Cidadao>> atualizar(@PathVariable String cpf,
                                                          @Valid @RequestBody CidadaoCreateDTO dto) {
        return cidadaoService.atualizarCidadao(cpf, dto);
    }
}
