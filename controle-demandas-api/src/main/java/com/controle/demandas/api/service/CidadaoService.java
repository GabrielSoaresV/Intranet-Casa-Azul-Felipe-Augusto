package com.controle.demandas.api.service;
import com.controle.demandas.api.dtoCidadaos.*;
import com.controle.demandas.api.exception.CidadaoException;
import com.controle.demandas.api.exception.NotFoundException;
import com.controle.demandas.api.model.Cidadao;
import com.controle.demandas.api.repository.CidadaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CidadaoService {

    @Autowired
    private CidadaoRepository cidadaoRepository;

    public Cidadao criar(CidadaoCreateDTO dto) {
        if (existePorCpf(dto.getCpf())) {
            throw new CidadaoException.CidadaoDuplicatedException("Cidadão com este CPF já existe");
        }

        Cidadao cidadao = Cidadao.builder()
                .cpf(dto.getCpf())
                .nome(dto.getNome())
                .email(dto.getEmail())
                .build();

        return cidadaoRepository.save(cidadao);
    }

    public List<CidadaoSearchDTO> listarTodosCidadaos() {
        return cidadaoRepository.findAll().stream()
                .map(this::mapToSearchDTO)
                .collect(Collectors.toList());
    }

    public CidadaoSearchDTO buscarPorCpf(String cpf) {
        Cidadao cidadao = buscarPorCpfEntity(cpf);
        return mapToSearchDTO(cidadao);
    }

    public Cidadao buscarPorCpfEntity(String cpf) {
        return cidadaoRepository.findById(cpf)
                .orElseThrow(() -> new NotFoundException("Cidadão não encontrado"));
    }

    public Cidadao atualizarCidadao(String cpf, CidadaoUpdateDTO dto) {
        Cidadao existente = cidadaoRepository.findById(cpf)
                .orElseThrow(() -> new RuntimeException("Cidadão não encontrado"));

        existente.setNome(dto.getNome());
        existente.setEmail(dto.getEmail());

        return cidadaoRepository.save(existente);
    }

    public void excluirCidadao(String cpf) {
        Cidadao existente = buscarPorCpfEntity(cpf);
        cidadaoRepository.delete(existente);
    }

    public boolean existePorCpf(String cpf) {
        return cidadaoRepository.existsByCpf(cpf);
    }

    public CidadaoSearchDTO mapToSearchDTO(Cidadao c) {
        return CidadaoSearchDTO.builder()
                .cpf(c.getCpf())
                .nome(c.getNome())
                .email(c.getEmail())
                .build();
    }

    public String identificarNome(String cpf) {
        Cidadao cidadao = buscarPorCpfEntity(cpf);
        return cidadao.getNome();
    }
}
