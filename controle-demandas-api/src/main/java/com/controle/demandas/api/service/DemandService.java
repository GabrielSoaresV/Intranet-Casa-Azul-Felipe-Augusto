package com.controle.demandas.api.service;

import com.controle.demandas.api.exception.NotFoundException;
import com.controle.demandas.api.model.Demand;
import com.controle.demandas.api.model.Profile;
import com.controle.demandas.api.repository.DemandRepository;
import com.controle.demandas.api.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    // Usuário autenticado
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

    public Demand atualizarStatus(String id, Demand.Status novoStatus) {
        Demand demanda = buscarPorId(id);
        demanda.setStatus(novoStatus);
        demanda.setUpdatedAt(Instant.now());
        return demandRepository.save(demanda);
    }

    public Demand atribuirDemanda(String id, Profile usuarioDesignado) {
        Demand demanda = buscarPorId(id);
        demanda.setAssignedUser(usuarioDesignado);
        demanda.setStatus(Demand.Status.IN_PROGRESS);
        demanda.setUpdatedAt(Instant.now());
        return demandRepository.save(demanda);
    }
}
