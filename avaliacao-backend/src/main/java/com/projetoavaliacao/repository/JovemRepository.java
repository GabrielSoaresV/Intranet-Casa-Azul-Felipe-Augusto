package com.projetoavaliacao.repository;

import com.projetoavaliacao.model.JovemAprendiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JovemRepository extends JpaRepository<JovemAprendiz, String> {}

