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

    /** 🔹 Busca histórico de uma demanda específica */
    public List<DemandHistory> getHistoryByDemand(String demandId) {
        return historyRepository.findByDemandIdOrderByCreatedAtDesc(demandId);
    }

    /** 🔹 Cria um registro de histórico de forma segura */
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
