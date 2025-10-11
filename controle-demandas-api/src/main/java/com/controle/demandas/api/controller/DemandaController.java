package com.controle.demandas.api.controller;

import com.controle.demandas.api.dto.DemandaCreateDTO;
import com.controle.demandas.api.dto.DemandaStatusDTO;
import com.controle.demandas.api.dto.DemandasCidadaoDTO;
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
@CrossOrigin(origins = "http://localhost:4200")
public class DemandaController {

    @Autowired
    private DemandaService demandaService;

    @PostMapping
    public ResponseEntity<ApiResponse<Demanda>> criar(@Valid @RequestBody DemandaCreateDTO dto) {
        return demandaService.criar(dto);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Demanda>>> listar() {
        return demandaService.listarTodos();
    }

    @GetMapping("/cidadao/{cpf}")
    public ResponseEntity<ApiResponse<List<DemandasCidadaoDTO>>> listarPorCidadao(@PathVariable String cpf) {
        return demandaService.listarPorCidadao(cpf);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Demanda>> buscarPorId(@PathVariable Long id) {
        Demanda demanda = demandaService.buscarPorId(id);
        return ResponseEntity.ok(ApiResponse.success("Demanda encontrada com sucesso!", demanda));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Demanda>> alterarStatus(@PathVariable Long id,
                                                              @Valid @RequestBody DemandaStatusDTO dto) {
        return demandaService.alterarStatus(id, dto.getAcao());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Demanda>> atualizarDemanda(@PathVariable Long id,
                                                                 @Valid @RequestBody DemandaCreateDTO dto) {
        return demandaService.atualizarDemanda(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> excluir(@PathVariable Long id) {
        return demandaService.excluir(id);
    }
}
