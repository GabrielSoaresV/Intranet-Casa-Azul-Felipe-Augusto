package com.controle.demandas.api.service;

import com.controle.demandas.api.model.Demanda;
import com.controle.demandas.api.repository.DemandaRepository;
import com.controle.demandas.api.exception.NotFound;
import com.controle.demandas.api.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DemandaService {

    @Autowired
    private DemandaRepository demandaRepository;

    public ApiResponse<Demanda> salvar(Demanda demanda) {
        Demanda salvo = demandaRepository.save(demanda);
        return new ApiResponse<>(true, "Demanda criada com sucesso!", salvo);
    }

    public ApiResponse<List<Demanda>> listarTodos() {
        List<Demanda> demandas = demandaRepository.findAll();
        return new ApiResponse<>(true, "Lista de demandas recuperada com sucesso!", demandas);
    }

    public ApiResponse<List<Demanda>> listarPorCidadao(String cpf) {
        List<Demanda> demandas = demandaRepository.findByCidadaoCpf(cpf);
        if (demandas.isEmpty()) {
            throw new NotFound("Nenhuma demanda encontrada para o cidadão com CPF: " + cpf);
        }
        return new ApiResponse<>(true, "Demandas do cidadão recuperadas com sucesso!", demandas);
    }

    public ApiResponse<Demanda> buscarPorId(Long id) {
        Demanda demanda = demandaRepository.findById(id)
                .orElseThrow(() -> new NotFound("Demanda não encontrada com ID: " + id));
        return new ApiResponse<>(true, "Demanda encontrada com sucesso!", demanda);
    }

    public ApiResponse<Demanda> alterarStatus(Long id, String novoStatus) {
        Demanda demanda = buscarPorId(id).getData();
        demanda.setStatus(novoStatus);
        Demanda atualizado = demandaRepository.save(demanda);
        return new ApiResponse<>(true, "Status da demanda alterado com sucesso!", atualizado);
    }

    public ApiResponse<Void> excluir(Long id) {
        if (!demandaRepository.existsById(id)) {
            throw new NotFound("Demanda não encontrada com ID: " + id);
        }
        demandaRepository.deleteById(id);
        return new ApiResponse<>(true, "Demanda excluída com sucesso!", null);
    }
}
