package com.projetoavaliacao.controller;

import com.projetoavaliacao.model.Empresa;
import com.projetoavaliacao.service.EmpresaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    private final EmpresaService service;

    public EmpresaController(EmpresaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Empresa> listarTodas() {
        return service.listarTodas();
    }

    @PostMapping
    public Empresa salvar(@RequestBody Empresa empresa) {
        return service.salvar(empresa);
    }

    @DeleteMapping("/{cnpj}")
    public ResponseEntity<Void> excluir(@PathVariable String cnpj) {
        boolean removido = service.excluir(cnpj);
        return removido ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @PutMapping("/{cnpj}")
    public ResponseEntity<Empresa> atualizar(@PathVariable String cnpj, @RequestBody Empresa empresaAtualizada) {
        Empresa empresa = service.atualizar(cnpj, empresaAtualizada);
        return (empresa != null)
                ? ResponseEntity.ok(empresa)
                : ResponseEntity.notFound().build();
    }
} 
