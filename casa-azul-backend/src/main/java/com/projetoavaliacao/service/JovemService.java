package com.projetoavaliacao.service;

import com.projetoavaliacao.model.JovemAprendiz;
import com.projetoavaliacao.repository.JovemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class JovemService {

    private final JovemRepository repo;

    public JovemService(JovemRepository repo) {
        this.repo = repo;
    }

    public List<JovemAprendiz> listarTodos() {
        return repo.findAll();
    }

    public JovemAprendiz salvar(JovemAprendiz jovem) {
        if (repo.existsById(jovem.getMatricula())) {
            throw new RuntimeException("Já existe um jovem cadastrado com a matrícula: " + jovem.getMatricula());
        }

        if (repo.existsByEmail(jovem.getEmail())) {
            throw new RuntimeException("Já existe um jovem cadastrado com o e-mail: " + jovem.getEmail());
        }

        return repo.save(jovem);
    }

    public void excluir(String matricula) {
        if (!repo.existsById(matricula)) {
            throw new RuntimeException("Jovem não encontrado com matrícula: " + matricula);
        }
        repo.deleteById(matricula);
    }

    public JovemAprendiz atualizar(String matricula, JovemAprendiz jovemAtualizado) {
        return repo.findById(matricula)
                .map(jovem -> {
                    jovem.setNome(jovemAtualizado.getNome());
                    jovem.setContratacao(jovemAtualizado.getContratacao());
                    jovem.setRescisao(jovemAtualizado.getRescisao());
                    jovem.setEmpresa(jovemAtualizado.getEmpresa());
                    jovem.setPeriodoAvaliacao(jovemAtualizado.getPeriodoAvaliacao());
                    jovem.setEmail(jovemAtualizado.getEmail());
                    jovem.setTelefone(jovemAtualizado.getTelefone());
                    jovem.setNomeresponsavel(jovemAtualizado.getNomeresponsavel());
                    jovem.setTelefoneresponsavel(jovemAtualizado.getTelefoneresponsavel());
                    jovem.setObservacoes(jovemAtualizado.getObservacoes());
                    return repo.save(jovem);
                })
                .orElseThrow(() -> new RuntimeException("Jovem não encontrado com matrícula: " + matricula));
    }

    public JovemAprendiz buscarPorMatricula(String matricula) {
        return repo.findById(matricula)
                .orElseThrow(() -> new RuntimeException("Jovem não encontrado com matrícula: " + matricula));
    }

    public List<JovemAprendiz> buscarPorFiltro(String filtro) {
        return repo.findAll(JovemSpecification.pesquisa(filtro));
    }
}
