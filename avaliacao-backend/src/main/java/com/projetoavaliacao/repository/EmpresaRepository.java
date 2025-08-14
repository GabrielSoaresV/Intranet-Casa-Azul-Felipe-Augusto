package com.projetoavaliacao.repository;

import com.projetoavaliacao.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpresaRepository extends JpaRepository<Empresa, String> {
}
