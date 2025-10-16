package com.controle.demandas.api.service;

import com.controle.demandas.api.exception.NotFoundException;
import com.controle.demandas.api.model.Demand;
import com.controle.demandas.api.model.DemandHistory;
import com.controle.demandas.api.model.Profile;
import com.controle.demandas.api.repository.DemandHistoryRepository;
import com.controle.demandas.api.repository.DemandRepository;
import com.controle.demandas.api.repository.ProfileRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class DemandService {

    @Autowired
    private DemandRepository demandRepository;

    @Autowired
    private DemandHistoryRepository historyRepository;

    @Autowired
    private ProfileRepository profileRepository;

    public List<Demand> listarTodas() {
        return demandRepository.findAll();
    }

    public Demand buscarPorId(String id) {
        return demandRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Demanda não encontrada"));
    }

    public List<Demand> buscarPorCidadao(String citizenId) {
        return demandRepository.findByCitizenId(citizenId);
    }

    public Demand criar(Demand demand) {
        Demand nova = demandRepository.save(demand);
        criarHistorico(nova.getId(), DemandHistory.Action.CREATED, null, nova.getStatus(), "Demanda criada");
        return nova;
    }

    public Demand atualizarStatus(String id, Demand.Status novoStatus, String notas) {
        Demand demanda = buscarPorId(id);
        Demand.Status antigoStatus = demanda.getStatus();

        demanda.setStatus(novoStatus);
        demanda.setUpdatedAt(Instant.now());
        Demand atualizada = demandRepository.save(demanda);

        DemandHistory.Action acao = switch (novoStatus) {
            case COMPLETED -> DemandHistory.Action.COMPLETED;
            case CANCELLED -> DemandHistory.Action.CANCELLED;
            default -> DemandHistory.Action.UPDATED;
        };

        criarHistorico(id, acao, antigoStatus, novoStatus, notas);
        return atualizada;
    }

    public Demand atribuirDemanda(String id, String userId) {
        Demand demanda = buscarPorId(id);
        Profile user = profileRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        demanda.setAssignedUser(user);
        demanda.setStatus(Demand.Status.IN_PROGRESS);
        demanda.setUpdatedAt(Instant.now());

        criarHistorico(id, DemandHistory.Action.ASSIGNED, null, null, "Atribuído ao usuário " + user.getId());

        return demandRepository.save(demanda);
    }

    public void criarHistorico(String demandId, DemandHistory.Action action, Demand.Status oldStatus, Demand.Status newStatus, String notes) {
        Demand demanda = demandRepository.findById(demandId)
                .orElseThrow(() -> new NotFoundException("Demanda não encontrada"));

        DemandHistory historico = new DemandHistory();
        historico.setDemand(demanda);
        historico.setAction(action);
        historico.setOldStatus(oldStatus);
        historico.setNewStatus(newStatus);
        historico.setNotes(notes);
        historico.setCreatedAt(Instant.now());

        historyRepository.save(historico);
    }
}
