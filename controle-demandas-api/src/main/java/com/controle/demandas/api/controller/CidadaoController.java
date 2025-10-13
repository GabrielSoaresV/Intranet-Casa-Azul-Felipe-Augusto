package com.controle.demandas.api.controller;

import com.controle.demandas.api.dtoCidadaos.*;
import com.controle.demandas.api.model.Cidadao;
import com.controle.demandas.api.response.ApiResponse;
import com.controle.demandas.api.service.CidadaoService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cidadaos")
@CrossOrigin(origins = "http://localhost:4200")
public class CidadaoController {

    private final CidadaoService cidadaoService;

    public CidadaoController(CidadaoService cidadaoService) {
        this.cidadaoService = cidadaoService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CidadaoSearchDTO>> criar(
            @Valid @RequestBody CidadaoCreateDTO dto) {
        Cidadao criado = cidadaoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Cidadão cadastrado com sucesso!", cidadaoService.mapToSearchDTO(criado)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CidadaoSearchDTO>>> listarTodos() {
        List<CidadaoSearchDTO> listaDTO = cidadaoService.listarTodosCidadaos();
        return ResponseEntity.ok(ApiResponse.success("Lista de cidadãos recuperada com sucesso!", listaDTO));
    }

    @GetMapping("/{cpf}")
    public ResponseEntity<ApiResponse<CidadaoSearchDTO>> buscarPorCpf(@PathVariable String cpf) {
        CidadaoSearchDTO dto = cidadaoService.buscarPorCpf(cpf);
        return ResponseEntity.ok(ApiResponse.success("Cidadão encontrado com sucesso!", dto));
    }

    @PutMapping("/{cpf}")
    public ResponseEntity<ApiResponse<CidadaoSearchDTO>> atualizar(
            @PathVariable String cpf,
            @Valid @RequestBody CidadaoUpdateDTO dto) {

        try {
            Cidadao atualizado = cidadaoService.atualizarCidadao(cpf, dto);
            return ResponseEntity.ok(
                    ApiResponse.success("Cidadão atualizado com sucesso!", 
                                        cidadaoService.mapToSearchDTO(atualizado))
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), 
                                            "Erro ao atualizar cidadão: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{cpf}")
    public ResponseEntity<ApiResponse<Void>> excluir(@PathVariable String cpf) {
        cidadaoService.excluirCidadao(cpf);
        return ResponseEntity.ok(ApiResponse.success("Cidadão excluído com sucesso!", null));
    }

    @GetMapping("/{cpf}/nome")
    public ResponseEntity<String> identificarNome(@PathVariable String cpf) {
        String nome = cidadaoService.identificarNome(cpf);
        return ResponseEntity.ok(nome);
    }
}
