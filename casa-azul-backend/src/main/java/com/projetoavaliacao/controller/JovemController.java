package com.projetoavaliacao.controller;

import com.projetoavaliacao.model.JovemAprendiz;
import com.projetoavaliacao.service.JovemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/jovens")
public class JovemController {

    private final JovemService service;

    public JovemController(JovemService service) {
        this.service = service;
    }

    @GetMapping
    public List<JovemAprendiz> listarTodos() {
        return service.listarTodos();
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody JovemAprendiz jovem) {
        try {
            return ResponseEntity.ok(service.salvar(jovem));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{matricula}")
    public ResponseEntity<JovemAprendiz> buscarPorMatricula(@PathVariable String matricula) {
        try {
            return ResponseEntity.ok(service.buscarPorMatricula(matricula));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{matricula}")
    public ResponseEntity<JovemAprendiz> atualizar(@PathVariable String matricula, @RequestBody JovemAprendiz jovem) {
        try {
            return ResponseEntity.ok(service.atualizar(matricula, jovem));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{matricula}")
    public ResponseEntity<Void> excluir(@PathVariable String matricula) {
        try {
            service.excluir(matricula);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
}
