package com.projetoavaliacao.repository;

import com.projetoavaliacao.model.JovemAprendiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JovemRepository extends JpaRepository<JovemAprendiz, String>,
        JpaSpecificationExecutor<JovemAprendiz> {

    boolean existsByEmail(String email);
}
