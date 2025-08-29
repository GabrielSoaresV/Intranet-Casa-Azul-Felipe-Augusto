package com.projetoavaliacao.controller;

import com.projetoavaliacao.dto.AssociacaoDTO;
import com.projetoavaliacao.service.AssociacaoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/associacoes")
public class AssociacaoController {

    private final AssociacaoService service;

    public AssociacaoController(AssociacaoService service) {
        this.service = service;
    }

    // Retorna apenas os campos do DTO
    @GetMapping("/dto")
    public List<AssociacaoDTO> listarTodasDTO() {
        return service.listarTodasDTO();
    }
}
