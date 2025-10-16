package com.controle.demandas.api.service;

import com.controle.demandas.api.model.DemandHistory;
import com.controle.demandas.api.repository.DemandHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DemandHistoryService {

    @Autowired
    private DemandHistoryRepository historyRepository;

    public List<DemandHistory> getHistoryByDemand(String demandId) {
        return historyRepository.findByDemandIdOrderByCreatedAtDesc(demandId);
    }
}
