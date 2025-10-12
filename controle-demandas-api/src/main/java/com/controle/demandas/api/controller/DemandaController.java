package com.controle.demandas.api.controller;

import com.controle.demandas.api.dtoDemandas.*;
import com.controle.demandas.api.model.Demanda;
import com.controle.demandas.api.response.ApiResponse;
import com.controle.demandas.api.service.DemandaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/demandas")
@CrossOrigin(origins = "http://localhost:4200")
public class DemandaController {

    private final DemandaService demandaService;

    public DemandaController(DemandaService demandaService) {
        this.demandaService = demandaService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DemandaSearchDTO>> criar(@Valid @RequestBody DemandaCreateDTO dto) {
        Demanda criado = demandaService.criarDemanda(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Demanda criada com sucesso!", demandaService.mapToSearchDTO(criado)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DemandaSearchDTO>>> listarTodas() {
        List<DemandaSearchDTO> lista = demandaService.listarTodasDemandas();
        return ResponseEntity.ok(ApiResponse.success("Lista de demandas recuperada com sucesso!", lista));
    }

    @GetMapping("/cidadao/{cpf}")
    public ResponseEntity<ApiResponse<List<DemandaSearchDTO>>> listarPorCidadao(@PathVariable String cpf) {
        List<DemandaSearchDTO> lista = demandaService.listarPorCidadao(cpf);
        return ResponseEntity.ok(ApiResponse.success("Lista de demandas do cidadão recuperada com sucesso!", lista));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DemandaSearchDTO>> buscarPorId(@PathVariable Long id) {
        DemandaSearchDTO dto = demandaService.buscarPorId(id);
        return ResponseEntity.ok(ApiResponse.success("Demanda encontrada com sucesso!", dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DemandaSearchDTO>> atualizarDemanda(
            @PathVariable Long id,
            @Valid @RequestBody DemandaUpdateDTO dto) {
        Demanda atualizado = demandaService.atualizarDemanda(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Demanda atualizada com sucesso!", demandaService.mapToSearchDTO(atualizado)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<DemandaSearchDTO>> alterarStatus(
            @PathVariable Long id,
            @Valid @RequestBody DemandaStatusDTO dto) {
        Demanda atualizado = demandaService.alterarStatus(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Status da demanda alterado com sucesso!", demandaService.mapToSearchDTO(atualizado)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> excluir(@PathVariable Long id) {
        demandaService.excluirDemanda(id);
        return ResponseEntity.ok(ApiResponse.success("Demanda excluída com sucesso!", null));
    }

    @PostMapping("/filtrar")
    public ResponseEntity<ApiResponse<List<DemandaSearchDTO>>> filtrar(@Valid @RequestBody DemandaFilterDTO filter) {
        List<DemandaSearchDTO> lista = demandaService.filtrarDemanda(filter);
        return ResponseEntity.ok(ApiResponse.success("Demandas filtradas recuperadas com sucesso!", lista));
    }
}
