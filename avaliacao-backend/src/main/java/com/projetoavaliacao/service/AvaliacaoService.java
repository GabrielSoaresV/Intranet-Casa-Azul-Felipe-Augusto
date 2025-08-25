package com.projetoavaliacao.service;

import com.projetoavaliacao.model.ModelAvaliacao;
import com.projetoavaliacao.repository.AvaliacaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AvaliacaoService {

    private final AvaliacaoRepository repository;

    public AvaliacaoService(AvaliacaoRepository repository) {
        this.repository = repository;
    }

    public List<ModelAvaliacao> listarTodas() {
        return repository.findAll();
    }

    public ModelAvaliacao salvar(ModelAvaliacao avaliacao) {
        return repository.save(avaliacao);
    }

    public Optional<ModelAvaliacao> buscarPorId(String id) {
        return repository.findById(id);
    }

    public void deletar(String id) {
        repository.deleteById(id);
    }
}
