package com.controle.demandas.api.repository;

import com.controle.demandas.api.model.DemandHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandHistoryRepository extends JpaRepository<DemandHistory, String> {
    List<DemandHistory> findByDemandIdOrderByCreatedAtDesc(String demandId);
}
