package com.controle.demandas.api.service;

import com.controle.demandas.api.model.Cidadao;
import com.controle.demandas.api.repository.CidadaoRepository;
import com.controle.demandas.api.exception.NotFound;
import com.controle.demandas.api.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CidadaoService {

    @Autowired
    private CidadaoRepository cidadaoRepository;

    public ApiResponse<Cidadao> salvar(Cidadao cidadao) {
        Cidadao salvo = cidadaoRepository.save(cidadao);
        return new ApiResponse<>(true, "Cidadão salvo com sucesso!", salvo);
    }

    public ApiResponse<List<Cidadao>> listarTodos() {
        List<Cidadao> cidadaos = cidadaoRepository.findAll();
        return new ApiResponse<>(true, "Lista de cidadãos recuperada com sucesso!", cidadaos);
    }

    public ApiResponse<Cidadao> buscarPorCpf(String cpf) {
        Cidadao cidadao = cidadaoRepository.findById(cpf)
                .orElseThrow(() -> new NotFound("Cidadão não encontrado com CPF: " + cpf));
        return new ApiResponse<>(true, "Cidadão encontrado com sucesso!", cidadao);
    }

    public ApiResponse<Void> excluir(String cpf) {
        if (!cidadaoRepository.existsById(cpf)) {
            throw new NotFound("Cidadão não encontrado com CPF: " + cpf);
        }
        cidadaoRepository.deleteById(cpf);
        return new ApiResponse<>(true, "Cidadão excluído com sucesso!", null);
    }
}
