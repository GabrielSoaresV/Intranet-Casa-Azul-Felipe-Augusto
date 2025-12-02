package com.projetoavaliacao.controller;

import com.projetoavaliacao.model.JovemAprendiz;
import com.projetoavaliacao.service.JovemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pesquisa")
public class PesquisaController {

    private final JovemService service;

    public PesquisaController(JovemService service) {
        this.service = service;
    }

    @GetMapping
    public List<JovemAprendiz> buscarPorFiltro(@RequestParam String filtro) {
        return service.buscarPorFiltro(filtro);
    }
}
