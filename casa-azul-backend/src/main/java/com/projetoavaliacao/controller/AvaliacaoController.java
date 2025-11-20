package com.projetoavaliacao.controller;

import com.projetoavaliacao.model.Avaliacoes;
import com.projetoavaliacao.model.Avaliacoes.TipoAvaliacao;
import com.projetoavaliacao.model.JovemAprendiz;
import com.projetoavaliacao.repository.JovemRepository;
import com.projetoavaliacao.service.AvaliacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/avaliacoes")
public class AvaliacaoController {

    private final AvaliacaoService service;
    private final JovemRepository jovemRepository;

    public AvaliacaoController(AvaliacaoService service, JovemRepository jovemRepository) {
        this.service = service;
        this.jovemRepository = jovemRepository;
    }

    @GetMapping
    public List<Avaliacoes> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/jovem/{matricula}")
    public List<Avaliacoes> listarPorJovem(@PathVariable String matricula) {
        return service.listarPorJovem(matricula);
    }

    @PostMapping("/{matricula}")
    public ResponseEntity<?> salvar(@PathVariable String matricula, @RequestBody Avaliacoes avaliacao) {
        JovemAprendiz jovem = jovemRepository.findById(matricula)
                .orElseThrow(() -> new RuntimeException("Jovem não encontrado"));

        // Busca todas as avaliações do jovem
        List<Avaliacoes> avaliacoesExistentes = service.listarPorJovem(matricula);

        // Verifica se já atingiu a última avaliação
        if (avaliacoesExistentes.size() >= 4) {
            return ResponseEntity.badRequest().body("Não é possível cadastrar mais avaliações para este jovem");
        }

        // Define automaticamente o número da avaliação
        TipoAvaliacao proxima;
        if (avaliacoesExistentes.isEmpty()) {
            proxima = TipoAvaliacao.UM;
        } else {
            TipoAvaliacao ultima = avaliacoesExistentes.get(avaliacoesExistentes.size() - 1).getNumeroAvaliacao();
            proxima = TipoAvaliacao.proximo(ultima);
        }

        avaliacao.setJovem(jovem);
        avaliacao.setNumeroAvaliacao(proxima);

        Avaliacoes salva = service.salvar(avaliacao);
        return ResponseEntity.ok(salva);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
