package com.controle.demandas.api.repository;

import com.controle.demandas.api.model.Demand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandRepository extends JpaRepository<Demand, String>, JpaSpecificationExecutor<Demand> {

    // Busca todas as demandas criadas por um Perfil específico (usando CPF)
    List<Demand> findByCreatedByCpf(String cpf);

    // Busca todas as demandas atribuídas a um Perfil específico (usando CPF)
    List<Demand> findByAssignedUserCpf(String cpf);

    // Busca todas as demandas com um status específico
    List<Demand> findByStatus(Demand.Status status);

    // Busca todas as demandas criadas por um Perfil específico e com um status específico
    List<Demand> findByCreatedByCpfAndStatus(String cpf, Demand.Status status);
    
}
