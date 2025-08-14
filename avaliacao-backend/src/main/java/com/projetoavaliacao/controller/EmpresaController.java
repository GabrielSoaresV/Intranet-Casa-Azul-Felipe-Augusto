package com.projetoavaliacao.controller;

import com.projetoavaliacao.model.Empresa;
import com.projetoavaliacao.repository.EmpresaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    private final EmpresaRepository repo;

    public EmpresaController(EmpresaRepository repo) {
        this.repo = repo;
    }

    // Listar todas as empresas
    @GetMapping
    public List<Empresa> listarTodas() {
        return repo.findAll();
    }

    // Criar nova empresa
    @PostMapping
    public Empresa salvar(@RequestBody Empresa empresa) {
        return repo.save(empresa);
    }

    // Deletar empresa pelo CNPJ
    @DeleteMapping("/{cnpj}")
    public ResponseEntity<Void> excluir(@PathVariable String cnpj) {
        if (!repo.existsById(cnpj)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(cnpj);
        return ResponseEntity.noContent().build();
    }

    // Atualizar empresa pelo CNPJ
    @PutMapping("/{cnpj}")
    public ResponseEntity<Empresa> atualizar(@PathVariable String cnpj, @RequestBody Empresa empresaAtualizada) {
        return repo.findById(cnpj)
                .map(empresa -> {
                    empresa.setNomeEmpresa(empresaAtualizada.getNomeEmpresa());
                    empresa.setEmailEmpresa(empresaAtualizada.getEmailEmpresa());
                    empresa.setTelefoneEmpresa(empresaAtualizada.getTelefoneEmpresa());
                    empresa.setRhNomeResponsavel(empresaAtualizada.getRhNomeResponsavel());
                    empresa.setRhEmailResponsavel(empresaAtualizada.getRhEmailResponsavel());
                    repo.save(empresa);
                    return ResponseEntity.ok(empresa);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
