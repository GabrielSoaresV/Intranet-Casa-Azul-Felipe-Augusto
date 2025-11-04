package com.controle.demandas.api.service;

import com.controle.demandas.api.exception.NotFoundException;
import com.controle.demandas.api.model.Demand;
import com.controle.demandas.api.model.DemandHistory;
import com.controle.demandas.api.model.Profile;
import com.controle.demandas.api.repository.DemandRepository;
import com.controle.demandas.api.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class DemandService {

    @Autowired
    private DemandRepository demandRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private DemandHistoryService historyService;

    /** 🔹 Obtém o usuário autenticado (via SecurityContextHolder) */
    private Profile getUsuarioAutenticado() {
        String login = SecurityContextHolder.getContext().getAuthentication().getName();
        return profileRepository.findByCpfOrEmail(login, login)
                .orElseThrow(() -> new NotFoundException("Usuário autenticado não encontrado"));
    }

    public List<Demand> listarTodas() {
        return demandRepository.findAll();
    }

    public Demand buscarPorId(String id) {
        return demandRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Demanda não encontrada"));
    }

    public List<Demand> buscarPorCriador(String cpf) {
        return demandRepository.findByCreatedByCpf(cpf);
    }

    public Demand criar(Demand demand) {
        Profile criador = getUsuarioAutenticado();
        demand.setCreatedBy(criador);
        demand.setCreator(criador);
        demand.setStatus(Demand.Status.PENDING);
        demand.setCreatedAt(Instant.now());
        demand.setUpdatedAt(Instant.now());
        return demandRepository.save(demand);
    }

    /** 🔹 Atualiza o status e registra histórico */
    public Demand atualizarStatus(String id, Demand.Status novoStatus) {
        Demand demanda = buscarPorId(id);
        Demand.Status statusAntigo = demanda.getStatus();

        if (statusAntigo == novoStatus) {
            // evita salvar status idêntico
            return demanda;
        }

        demanda.setStatus(novoStatus);
        demanda.setUpdatedAt(Instant.now());
        Demand atualizada = demandRepository.save(demanda);

        // 🔹 Cria registro no histórico
        DemandHistory historico = new DemandHistory();
        historico.setDemand(demanda);
        historico.setAction(DemandHistory.Action.UPDATED);
        historico.setOldStatus(statusAntigo);
        historico.setNewStatus(novoStatus);
        historico.setNotes("Status alterado de " + statusAntigo + " para " + novoStatus);
        historico.setCreatedAt(Instant.now());

        // 🔹 Usuário que realizou a ação
        Profile usuario = getUsuarioAutenticado();
        historico.setPerformedBy(usuario);

        historyService.criarHistorico(historico);

        return atualizada;
    }

    /** 🔹 Atribui usuário a uma demanda e registra histórico */
    public Demand atribuirDemanda(String id, Profile usuarioDesignado) {
        Demand demanda = buscarPorId(id);
        Demand.Status statusAntigo = demanda.getStatus();

        demanda.setAssignedUser(usuarioDesignado);
        demanda.setStatus(Demand.Status.IN_PROGRESS);
        demanda.setUpdatedAt(Instant.now());
        Demand atualizada = demandRepository.save(demanda);

        // 🔹 Cria histórico de atribuição
        DemandHistory historico = new DemandHistory();
        historico.setDemand(demanda);
        historico.setAction(DemandHistory.Action.ASSIGNED);
        historico.setOldStatus(statusAntigo);
        historico.setNewStatus(Demand.Status.IN_PROGRESS);
        historico.setNotes("Demanda atribuída para " + usuarioDesignado.getName());
        historico.setCreatedAt(Instant.now());

        Profile usuario = getUsuarioAutenticado();
        historico.setPerformedBy(usuario);

        historyService.criarHistorico(historico);

        return atualizada;
    }

    public List<Demand> searchDemands(String term, String status, String priority) {
    Specification<Demand> spec = Specification.where(null);

    if (term != null && !term.isBlank()) {
        spec = spec.and((root, query, cb) -> cb.or(
            cb.like(cb.lower(root.get("title")), "%" + term.toLowerCase() + "%"),
            cb.like(cb.lower(root.get("creator").get("name")), "%" + term.toLowerCase() + "%"),
            cb.like(cb.lower(root.get("id").as(String.class)), "%" + term.toLowerCase() + "%")
        ));
    }

    if (status != null && !status.isBlank()) {
        spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
    }

    if (priority != null && !priority.isBlank()) {
        spec = spec.and((root, query, cb) -> cb.equal(root.get("priority"), priority));
    }

    return demandRepository.findAll(spec);
}

}
