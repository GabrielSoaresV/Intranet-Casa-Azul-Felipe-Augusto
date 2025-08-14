package com.projetoavaliacao.controller;

import com.projetoavaliacao.model.JovemAprendiz;
import com.projetoavaliacao.repository.JovemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/jovens")
public class JovemController {

    private final JovemRepository repo;

    public JovemController(JovemRepository repo) {
        this.repo = repo;
    }
    
    @GetMapping
    public List<JovemAprendiz> listarTodos() {
        return repo.findAll();
    }

    @PostMapping
    public JovemAprendiz salvar(@RequestBody JovemAprendiz jovem) {
        return repo.save(jovem);
    }

    @DeleteMapping("/{matricula}")
    public ResponseEntity<Void> excluir(@PathVariable String matricula) {
        if (!repo.existsById(matricula)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(matricula);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{matricula}")
    public ResponseEntity<JovemAprendiz> atualizar(@PathVariable String matricula, @RequestBody JovemAprendiz jovemAtualizado) {
        return repo.findById(matricula)
                .map(jovem -> {
                    jovem.setNome(jovemAtualizado.getNome());
                    jovem.setContratacao(jovemAtualizado.getContratacao());
                    jovem.setRescisao(jovemAtualizado.getRescisao());
                    jovem.setStatus(jovemAtualizado.getStatus());
                    jovem.setEmpresa(jovemAtualizado.getEmpresa());
                    jovem.setPeriodoAvaliacao(jovemAtualizado.getPeriodoAvaliacao());
                    jovem.setEmail(jovemAtualizado.getEmail());
                    jovem.setTelefone(jovemAtualizado.getTelefone());
                    jovem.setNomeresponsavel(jovemAtualizado.getNomeresponsavel());
                    jovem.setTelefoneresponsavel(jovemAtualizado.getTelefoneresponsavel());
                    jovem.setObservacoes(jovemAtualizado.getObservacoes());

                    repo.save(jovem);
                    return ResponseEntity.ok(jovem);
                })
                .orElse(ResponseEntity.notFound().build());
    }

}
