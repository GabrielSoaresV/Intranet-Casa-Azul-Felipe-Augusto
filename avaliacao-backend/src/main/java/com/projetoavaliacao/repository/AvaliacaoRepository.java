package com.projetoavaliacao.repository;

import com.projetoavaliacao.model.ModelAvaliacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvaliacaoRepository extends JpaRepository<ModelAvaliacao, String> {
}
