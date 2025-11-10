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
        historico.setDemandId(demanda.getId());
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

        // 🔹 Primeiro apaga históricos ligados à demanda
        List<DemandHistory> historicos = historyService.getHistoryByDemand(demanda.getId());
        if (!historicos.isEmpty()) {
            historicos.forEach(h -> historyService.deleteHistory(h));
        }

        // 🔹 Cria histórico de exclusão (sem vincular FK para evitar erro)
        DemandHistory historico = new DemandHistory();
        historico.setDemandId(demanda.getId());
        historico.setAction(DemandHistory.Action.DELETED);
        historico.setOldStatus(demanda.getStatus());
        historico.setNewStatus(null);
        historico.setNotes("Demanda excluída por " + usuario.getName());
        historico.setPerformedBy(usuario);
        historico.setCreatedAt(Instant.now());
        historyService.criarHistorico(historico);

        // 🔹 Agora sim, remove a demanda
        demandRepository.delete(demanda);
    }


    /** 🔹 Atribui o usuário autenticado como responsável e registra histórico */
    public Demand atribuirDemanda(String id) {
        Demand demanda = buscarPorId(id);
        Demand.Status statusAntigo = demanda.getStatus();

        // 🔹 Pega o usuário autenticado (atendente que está logado)
        Profile usuarioAutenticado = getUsuarioAutenticado();
        System.out.println("👤 Atribuindo demanda para: " + usuarioAutenticado.getCpf() + " (" + usuarioAutenticado.getName() + ")");

        // 🔹 Define como responsável e altera status
        demanda.setAssignedUser(usuarioAutenticado);
        demanda.setStatus(Demand.Status.IN_PROGRESS);
        demanda.setUpdatedBy(usuarioAutenticado);
        demanda.setUpdatedAt(Instant.now());

        // 🔹 Salva no banco
        demanda = demandRepository.saveAndFlush(demanda);

        // 🔹 Cria histórico de atribuição
        DemandHistory historico = new DemandHistory();
        historico.setDemandId(demanda.getId());
        historico.setAction(DemandHistory.Action.ASSIGNED);
        historico.setOldStatus(statusAntigo);
        historico.setNewStatus(Demand.Status.IN_PROGRESS);
        historico.setNotes("Demanda atribuída para " + usuarioAutenticado.getName());
        historico.setPerformedBy(usuarioAutenticado);
        historico.setUser(usuarioAutenticado);
        historico.setCreatedAt(Instant.now());

        historyService.criarHistorico(historico);

        // ✅ Retorna a demanda salva (sem código morto)
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
