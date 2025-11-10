package com.controle.demandas.api.service;

import com.controle.demandas.api.model.DemandHistory;
import com.controle.demandas.api.repository.DemandHistoryRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DemandHistoryService {

    @Autowired
    private DemandHistoryRepository historyRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public List<DemandHistory> getHistoryByDemand(String demandId) {
        return historyRepository.findByDemandIdOrderByCreatedAtDesc(demandId);
    }

    @Transactional
    public DemandHistory criarHistorico(DemandHistory historico) {
        if (historico.getDemandId() == null) {
            throw new IllegalStateException("Histórico precisa ter um ID de demanda.");
        }
        return historyRepository.save(historico);
    }

    @Transactional
    public void deleteHistory(DemandHistory historico) {
        historyRepository.delete(historico);
    }
}
