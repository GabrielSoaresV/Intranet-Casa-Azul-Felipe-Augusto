package com.projetoavaliacao.repository;

import com.projetoavaliacao.model.Associacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AssociacaoRepository extends JpaRepository<Associacao, Long> {

    // Método derivado do Spring Data JPA
    List<Associacao> findByJovemMatricula(String matricula);

    // Ou usando query JPQL
    @Query("SELECT a FROM Associacao a WHERE a.jovem.matricula = :matricula")
    List<Associacao> buscarPorMatricula(@Param("matricula") String matricula);
}
