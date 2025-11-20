package com.projetoavaliacao.repository;

import com.projetoavaliacao.model.Avaliacoes;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AvaliacaoRepository extends JpaRepository<Avaliacoes, Long> {
    List<Avaliacoes> findByJovemMatricula(String matricula);
}
