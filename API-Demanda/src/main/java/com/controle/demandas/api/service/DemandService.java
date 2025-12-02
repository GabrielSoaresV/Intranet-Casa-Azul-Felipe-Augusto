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
import org.springframework.security.access.AccessDeniedException;
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

        Demand nova = demandRepository.save(demand);

        DemandHistory historico = new DemandHistory();
        historico.setDemandId(nova.getId());
        historico.setAction(DemandHistory.Action.CREATED);
        historico.setPerformedBy(criador);
        historico.setOldStatus(null);
        historico.setNewStatus(Demand.Status.PENDING);
        historico.setNotes("Demanda criada por " + criador.getName());
        historico.setCreatedAt(Instant.now());

        historyService.criarHistorico(historico);
        return nova;
    }

    public Demand atualizarStatus(String id, Demand.Status novoStatus) {
        Demand demanda = buscarPorId(id);
        Demand.Status statusAntigo = demanda.getStatus();

        if (statusAntigo == novoStatus) return demanda;

        Profile usuario = getUsuarioAutenticado();
        demanda.setStatus(novoStatus);
        demanda.setUpdatedBy(usuario);
        demanda.setUpdatedAt(Instant.now());
        Demand atualizada = demandRepository.save(demanda);

        DemandHistory historico = new DemandHistory();
        historico.setDemandId(demanda.getId());
        historico.setOldStatus(statusAntigo);
        historico.setNewStatus(novoStatus);
        historico.setPerformedBy(usuario);
        historico.setCreatedAt(Instant.now());

        switch (novoStatus) {
            case IN_PROGRESS -> {
                historico.setAction(DemandHistory.Action.ASSIGNED);
                historico.setNotes("Demanda atribuída a " + usuario.getName());
            }
            case RETURNED -> {
                historico.setAction(DemandHistory.Action.RETURNED);
                historico.setNotes("Demanda devolvida por " + usuario.getName());
            }
            case COMPLETED -> {
                historico.setAction(DemandHistory.Action.COMPLETED);
                historico.setNotes("Demanda concluída por " + usuario.getName());
            }
            case CANCELLED -> {
                historico.setAction(DemandHistory.Action.CANCELLED);
                historico.setNotes("Demanda cancelada por " + usuario.getName());
            }
            default -> {
                historico.setAction(DemandHistory.Action.UPDATED);
                historico.setNotes("Status alterado de " + statusAntigo + " para " + novoStatus);
            }
        }

        historyService.criarHistorico(historico);
        return atualizada;
    }

    public void deletarDemanda(String id) {
        Demand demanda = buscarPorId(id);
        Profile usuario = getUsuarioAutenticado();

        boolean ehCriador = demanda.getCreator() != null &&
                usuario.getCpf().equals(demanda.getCreator().getCpf());
        boolean ehAdmin = usuario.getRole() != null &&
                "ADMIN".equalsIgnoreCase(usuario.getRole().toString());

        if (!ehCriador && !ehAdmin) {
            throw new AccessDeniedException("Você não tem permissão para excluir esta demanda.");
        }

        DemandHistory historico = new DemandHistory();
        historico.setDemandId(demanda.getId());
        historico.setAction(DemandHistory.Action.CANCELLED);
        historico.setOldStatus(demanda.getStatus());
        historico.setNewStatus(null);
        historico.setNotes("Demanda excluída por " + usuario.getName());
        historico.setPerformedBy(usuario);
        historico.setCreatedAt(Instant.now());
        historyService.criarHistorico(historico);

        List<DemandHistory> historicos = historyService.getHistoryByDemand(demanda.getId());
        if (!historicos.isEmpty()) {
            historicos.forEach(h -> historyService.deleteHistory(h));
        }

        demandRepository.delete(demanda);
    }

    public Demand atribuirDemanda(String id) {
        Demand demanda = buscarPorId(id);
        Demand.Status statusAntigo = demanda.getStatus();
        Profile usuario = getUsuarioAutenticado();

        demanda.setAssignedUser(usuario);
        demanda.setStatus(Demand.Status.IN_PROGRESS);
        demanda.setUpdatedBy(usuario);
        demanda.setUpdatedAt(Instant.now());
        demanda = demandRepository.saveAndFlush(demanda);

        DemandHistory historico = new DemandHistory();
        historico.setDemandId(demanda.getId());
        historico.setAction(DemandHistory.Action.ASSIGNED);
        historico.setOldStatus(statusAntigo);
        historico.setNewStatus(Demand.Status.IN_PROGRESS);
        historico.setNotes("Demanda atribuída para " + usuario.getName());
        historico.setPerformedBy(usuario);
        historico.setUser(usuario);
        historico.setCreatedAt(Instant.now());

        historyService.criarHistorico(historico);
        return demanda;
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
