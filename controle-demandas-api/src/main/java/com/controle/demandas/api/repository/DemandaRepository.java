package com.controle.demandas.api.repository;

import com.controle.demandas.api.model.Demanda;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DemandaRepository extends JpaRepository<Demanda, Long> {

    List<Demanda> findByCidadaoCpf(String cpf);

    boolean existsByTitulo(String titulo); 
}
