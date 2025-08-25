package com.projetoavaliacao.repository;

import com.projetoavaliacao.model.Associacao;
import com.projetoavaliacao.model.JovemAprendiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssociacaoRepository extends JpaRepository<Associacao, Long> {
    long countByJovemMatricula(String matricula); // Para contar avaliações de um jovem
    List<Associacao> findByJovem(JovemAprendiz jovem);
}
