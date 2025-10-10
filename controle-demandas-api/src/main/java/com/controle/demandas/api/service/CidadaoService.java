package com.controle.demandas.api.service;

import com.controle.demandas.api.dto.CidadaoCreateDTO;
import com.controle.demandas.api.exception.CidadaoException;
import com.controle.demandas.api.model.Cidadao;
import com.controle.demandas.api.repository.CidadaoRepository;
import com.controle.demandas.api.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CidadaoService {

    @Autowired
    private CidadaoRepository cidadaoRepository;

    public ResponseEntity<ApiResponse<Cidadao>> criar(CidadaoCreateDTO dto) {
        if (existePorCpf(dto.getCpf())) {
            throw new CidadaoException.CidadaoDuplicatedException("Cidadão com este CPF já existe");
        }

        Cidadao cidadao = Cidadao.builder()
                .cpf(dto.getCpf())
                .nome(dto.getNome())
                .email(dto.getEmail())
                .build();

        Cidadao salvo = salvar(cidadao);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Cidadão cadastrado com sucesso!", salvo));
    }

    public ResponseEntity<ApiResponse<List<Cidadao>>> listarTodosCidadaos() {
        List<Cidadao> cidadaos = listarTodos();
        return ResponseEntity.ok(ApiResponse.success("Lista de cidadãos recuperada com sucesso!", cidadaos));
    }

    public ResponseEntity<ApiResponse<Cidadao>> buscarPorCpfResponse(String cpf) {
        Cidadao cidadao = buscarPorCpf(cpf);
        if (cidadao == null) {
            throw new CidadaoException.CidadaoNotFoundException("Cidadão não encontrado");
        }
        return ResponseEntity.ok(ApiResponse.success("Cidadão encontrado com sucesso!", cidadao));
    }

    public ResponseEntity<ApiResponse<Void>> excluirCidadao(String cpf) {
        Cidadao cidadao = buscarPorCpf(cpf);
        if (cidadao == null) {
            throw new CidadaoException.CidadaoNotFoundException("Cidadão não encontrado");
        }
        excluir(cpf);
        return ResponseEntity.ok(ApiResponse.success("Cidadão excluído com sucesso!", null));
    }

    public ResponseEntity<ApiResponse<Cidadao>> atualizarCidadao(String cpf, CidadaoCreateDTO dto) {
        Cidadao cidadaoParaAtualizar = Cidadao.builder()
                .cpf(cpf)
                .nome(dto.getNome())
                .email(dto.getEmail())
                .build();

        Cidadao atualizado = atualizar(cpf, cidadaoParaAtualizar);
        return ResponseEntity.ok(ApiResponse.success("Cidadão atualizado com sucesso!", atualizado));
    }

    // -------------------- Métodos de repositório --------------------
    public Cidadao salvar(Cidadao cidadao) {
        return cidadaoRepository.save(cidadao);
    }

    public List<Cidadao> listarTodos() {
        return cidadaoRepository.findAll();
    }

    public Cidadao buscarPorCpf(String cpf) {
        return cidadaoRepository.findById(cpf).orElse(null);
    }

    public void excluir(String cpf) {
        cidadaoRepository.deleteById(cpf);
    }

    public boolean existePorCpf(String cpf) {
        return cidadaoRepository.existsByCpf(cpf);
    }

    public Cidadao atualizar(String cpf, Cidadao updatedCidadao) {
        Cidadao existente = cidadaoRepository.findById(cpf)
                .orElseThrow(() -> new CidadaoException.CidadaoNotFoundException("Cidadão não encontrado"));

        existente.setNome(updatedCidadao.getNome());
        existente.setEmail(updatedCidadao.getEmail());

        return cidadaoRepository.save(existente);
    }
}
