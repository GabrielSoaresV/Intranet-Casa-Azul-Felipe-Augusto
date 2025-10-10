package com.controle.demandas.api.service;

import com.controle.demandas.api.exception.NotFoundException;
import com.controle.demandas.api.model.Cidadao;
import com.controle.demandas.api.repository.CidadaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CidadaoService {

    @Autowired
    private CidadaoRepository cidadaoRepository;

    public Cidadao salvar(Cidadao cidadao) {
        if (cidadaoRepository.existsById(cidadao.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado!");
        }
        return cidadaoRepository.save(cidadao);
    }

    public List<Cidadao> listarTodos() {
        return cidadaoRepository.findAll();
    }

    public Cidadao buscarPorCpf(String cpf) {
        return cidadaoRepository.findById(cpf)
                .orElseThrow(() -> new NotFoundException("Cidadão não encontrado com CPF: " + cpf));
    }

    public void excluir(String cpf) {
        if (!cidadaoRepository.existsById(cpf)) {
            throw new NotFoundException("Cidadão não encontrado com CPF: " + cpf);
        }
        cidadaoRepository.deleteById(cpf);
    }
}
