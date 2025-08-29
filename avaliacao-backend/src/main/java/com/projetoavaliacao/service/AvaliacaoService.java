package com.projetoavaliacao.service;

import com.projetoavaliacao.model.Avaliacoes;
import com.projetoavaliacao.repository.AvaliacaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvaliacaoService {

    private final AvaliacaoRepository repo;

    public AvaliacaoService(AvaliacaoRepository repo) {
        this.repo = repo;
    }

    public List<Avaliacoes> listarTodos() {
        return repo.findAll();
    }

    public Avaliacoes salvar(Avaliacoes avaliacao) {
        return repo.save(avaliacao);
    }

    public void excluir(Long id) {
        repo.deleteById(id);
    }
}
