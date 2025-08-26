package com.projetoavaliacao.repository;

import com.projetoavaliacao.model.Avaliacoes;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvaliacaoRepository extends JpaRepository<Avaliacoes, Long> {
}
