package com.controle.demandas.api.repository;

import com.controle.demandas.api.model.Demand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandRepository extends JpaRepository<Demand, String> {
    List<Demand> findByCitizenId(String citizenId);
}
