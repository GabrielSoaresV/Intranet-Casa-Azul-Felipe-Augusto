package com.controle.demandas.api.repository;

import com.controle.demandas.api.model.Cidadao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CidadaoRepository extends JpaRepository<Cidadao, String> {
}
