package com.projetoavaliacao.controller;

import com.projetoavaliacao.model.Avaliacoes;
import com.projetoavaliacao.service.AvaliacaoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/avaliacoes")
public class AvaliacaoController {

    private final AvaliacaoService service;

    public AvaliacaoController(AvaliacaoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Avaliacoes> listarTodos() {
        return service.listarTodos();
    }

    @PostMapping
    public Avaliacoes salvar(@RequestBody Avaliacoes avaliacao) {
        return service.salvar(avaliacao);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
