package com.projetoavaliacao.controller;

import com.projetoavaliacao.model.Associacao;
import com.projetoavaliacao.model.JovemAprendiz;
import com.projetoavaliacao.model.ModelAvaliacao;
import com.projetoavaliacao.repository.AvaliacaoRepository;
import com.projetoavaliacao.repository.JovemRepository;
import com.projetoavaliacao.service.AssociacaoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/avaliacoes")
public class AvaliacaoController {

    private final AvaliacaoRepository avaliacaoRepository;
    private final AssociacaoService associacaoService;
    private final JovemRepository jovemRepository;

    public AvaliacaoController(AvaliacaoRepository avaliacaoRepository,
                               AssociacaoService associacaoService,
                               JovemRepository jovemRepository) {
        this.avaliacaoRepository = avaliacaoRepository;
        this.associacaoService = associacaoService;
        this.jovemRepository = jovemRepository;
    }

    @PostMapping
    public ModelAvaliacao criarAvaliacao(@RequestBody ModelAvaliacao avaliacao) {
        return avaliacaoRepository.save(avaliacao);
    }

    @PostMapping("/associar/{matricula}")
    public Associacao associar(@PathVariable String matricula, @RequestBody ModelAvaliacao avaliacao) {
        JovemAprendiz jovem = jovemRepository.findById(matricula)
                .orElseThrow(() -> new RuntimeException("Jovem não encontrado"));

        ModelAvaliacao avaliacaoSalva = avaliacaoRepository.save(avaliacao);

        return associacaoService.associarAvaliacao(jovem, avaliacaoSalva);
    }
}
