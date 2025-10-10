package com.controle.demandas.api.service;

import com.controle.demandas.api.exception.DemandaException;
import com.controle.demandas.api.model.Demanda;
import com.controle.demandas.api.model.Cidadao;
import com.controle.demandas.api.repository.DemandaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DemandaService {

    @Autowired
    private DemandaRepository demandaRepository;

    @Autowired
    private CidadaoService cidadaoService;

    public Demanda salvar(Demanda demanda) {
        // Verifica se o cidadão associado existe
        Cidadao cidadao = demanda.getCidadao();
        if (cidadao == null || cidadaoService.buscarPorCpf(cidadao.getCpf()) == null) {
            throw new DemandaException.DemandaForbiddenException("Cidadão associado não existe");
        }
        return demandaRepository.save(demanda);
    }

    public List<Demanda> listarTodos() {
        return demandaRepository.findAll();
    }

    public List<Demanda> listarPorCidadao(String cpf) {
        if (cidadaoService.buscarPorCpf(cpf) == null) {
            throw new DemandaException.DemandaForbiddenException("Cidadão não encontrado");
        }
        return demandaRepository.findByCidadaoCpf(cpf);
    }

    public Demanda buscarPorId(Long id) {
        Demanda demanda = demandaRepository.findById(id).orElse(null);
        if (demanda == null) {
            throw new DemandaException.DemandaNotFoundException("Demanda não encontrada");
        }
        return demanda;
    }

    public Demanda alterarStatus(Long id, String status) {
        Demanda demanda = buscarPorId(id); // já lança exceção se não existir
        demanda.setStatus(status);
        return demandaRepository.save(demanda);
    }

    public void excluir(Long id) {
        buscarPorId(id); // lança exceção se não existir
        demandaRepository.deleteById(id);
    }

    public boolean existePorTitulo(String titulo) {
        return demandaRepository.existsByTitulo(titulo);
    }
}
