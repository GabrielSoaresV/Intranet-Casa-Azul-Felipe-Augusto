package com.controle.demandas.api.repository;

import com.controle.demandas.api.model.Demanda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandaRepository extends JpaRepository<Demanda, Long> {

    // Lista todas as demandas associadas a um cidadão específico pelo CPF
    List<Demanda> findByCidadaoCpf(String cpf);

    // Verifica se já existe uma demanda com o mesmo título
    boolean existsByTitulo(String titulo);
}
