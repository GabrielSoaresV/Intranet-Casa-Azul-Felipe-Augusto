package com.controle.demandas.api.service;

import com.controle.demandas.api.exception.NotFoundException;
import com.controle.demandas.api.model.Demanda;
import com.controle.demandas.api.repository.DemandaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DemandaService {

    @Autowired
    private DemandaRepository demandaRepository;

    public Demanda salvar(Demanda demanda) {
        return demandaRepository.save(demanda);
    }

    public List<Demanda> listarTodos() {
        return demandaRepository.findAll();
    }

    public List<Demanda> listarPorCidadao(String cpf) {
        List<Demanda> demandas = demandaRepository.findByCidadaoCpf(cpf);
        if (demandas.isEmpty()) {
            throw new NotFoundException("Nenhuma demanda encontrada para o cidadão com CPF: " + cpf);
        }
        return demandas;
    }

    public Demanda buscarPorId(Long id) {
        return demandaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Demanda não encontrada com ID: " + id));
    }

    public Demanda alterarStatus(Long id, String novoStatus) {
        Demanda demanda = buscarPorId(id);
        demanda.setStatus(novoStatus);
        return demandaRepository.save(demanda);
    }

    public void excluir(Long id) {
        if (!demandaRepository.existsById(id)) {
            throw new NotFoundException("Demanda não encontrada com ID: " + id);
        }
        demandaRepository.deleteById(id);
    }
}
