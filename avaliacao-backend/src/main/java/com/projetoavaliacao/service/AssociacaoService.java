package com.projetoavaliacao.service;

import com.projetoavaliacao.model.Associacao;
import com.projetoavaliacao.model.JovemAprendiz;
import com.projetoavaliacao.model.ModelAvaliacao;
import com.projetoavaliacao.repository.AssociacaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssociacaoService {

    private final AssociacaoRepository repository;

    public AssociacaoService(AssociacaoRepository repository) {
        this.repository = repository;
    }

    public Associacao associarAvaliacao(JovemAprendiz jovem, ModelAvaliacao avaliacao) {
        // Aqui você pode colocar regra para limitar 4 avaliações por jovem
        List<Associacao> avaliacoesExistentes = repository.findByJovem(jovem);
        if (avaliacoesExistentes.size() >= 4) {
            throw new RuntimeException("Este jovem já possui 4 avaliações.");
        }

        Associacao associacao = new Associacao();
        associacao.setJovem(jovem);
        associacao.setAvaliacao(avaliacao);
        return repository.save(associacao);
    }

    public List<Associacao> listarPorJovem(JovemAprendiz jovem) {
        return repository.findByJovem(jovem);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
