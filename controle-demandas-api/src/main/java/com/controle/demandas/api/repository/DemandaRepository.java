package com.controle.demandas.api.repository;

import com.controle.demandas.api.model.Demanda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandaRepository extends JpaRepository<Demanda, Long> {

    List<Demanda> findByCidadaoCpf(String cpf);
}
