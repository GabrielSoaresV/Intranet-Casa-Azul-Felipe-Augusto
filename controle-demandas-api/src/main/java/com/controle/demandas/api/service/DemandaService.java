package com.controle.demandas.api.service;

import com.controle.demandas.api.dto.DemandaCreateDTO;
import com.controle.demandas.api.dto.DemandasCidadaoDTO;
import com.controle.demandas.api.exception.DemandaException;
import com.controle.demandas.api.model.Demanda;
import com.controle.demandas.api.model.Cidadao;
import com.controle.demandas.api.repository.DemandaRepository;
import com.controle.demandas.api.response.ApiResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DemandaService {

    @Autowired
    private DemandaRepository demandaRepository;

    @Autowired
    private CidadaoService cidadaoService;

    // -------------------- CRUD --------------------

    public ResponseEntity<ApiResponse<Demanda>> criar(DemandaCreateDTO dto) {
        // Verifica se o cidadão existe
        Cidadao cidadao = cidadaoService.buscarPorCpf(dto.getCpfCidadao());
        if (cidadao == null) {
            throw new DemandaException.DemandaNotFoundException("Cidadão não existe");
        }

        // Cria a demanda
        Demanda demanda = Demanda.builder()
            .titulo(dto.getTitulo())
            .descricao(dto.getDescricao())
            .status("Aberta") // aqui definimos o status inicial
            .cidadao(cidadao)
            .build();

        Demanda salvo = demandaRepository.save(demanda);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Demanda criada com sucesso!", salvo));
    }

    public ResponseEntity<ApiResponse<List<Demanda>>> listarTodos() {
        List<Demanda> demandas = demandaRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Lista de demandas recuperada com sucesso!", demandas));
    }

    public ResponseEntity<ApiResponse<List<DemandasCidadaoDTO>>> listarPorCidadao(String cpf) {
        Cidadao cidadao = cidadaoService.buscarPorCpf(cpf);
        if (cidadao == null) {
            throw new DemandaException.DemandaNotFoundException("Cidadão não encontrado");
        }

        List<Demanda> demandas = demandaRepository.findByCidadaoCpf(cpf);

        // Converter para DTO
        List<DemandasCidadaoDTO> listaDTO = demandas.stream().map(d ->
            DemandasCidadaoDTO.builder()
                .id(d.getId())
                .titulo(d.getTitulo())
                .descricao(d.getDescricao())
                .status(d.getStatus())
                .cpfCidadao(d.getCidadao().getCpf())
                .nomeCidadao(d.getCidadao().getNome())
                .emailCidadao(d.getCidadao().getEmail())
                .build()
        ).toList();

        String mensagem = String.format(
            "Lista de demandas do cidadão %s (CPF: %s) recuperada com sucesso!",
            cidadao.getNome(), cidadao.getCpf()
        );

        return ResponseEntity.ok(ApiResponse.success(mensagem, listaDTO));
    }

    public Demanda buscarPorId(Long id) {
        return demandaRepository.findById(id)
                .orElseThrow(() -> new DemandaException.DemandaNotFoundException("Demanda não encontrada"));
    }

    // Atualizar toda a demanda
    public ResponseEntity<ApiResponse<Demanda>> atualizarDemanda(Long id, DemandaCreateDTO dto) {
        Demanda demanda = buscarPorId(id); // busca existente

        // Atualiza os campos (não altera o status)
        demanda.setTitulo(dto.getTitulo());
        demanda.setDescricao(dto.getDescricao());

        // Atualiza o cidadão se necessário
        Cidadao cidadao = cidadaoService.buscarPorCpf(dto.getCpfCidadao());
        if (cidadao == null) {
            throw new DemandaException.DemandaForbiddenException("Cidadão não existe");
        }
        demanda.setCidadao(cidadao);

        Demanda atualizado = demandaRepository.save(demanda);
        return ResponseEntity.ok(ApiResponse.success("Demanda atualizada com sucesso!", atualizado));
    }

        // Alterar apenas status
    public ResponseEntity<ApiResponse<Demanda>> alterarStatus(Long id, String acao) {
        // Buscar demanda existente
        Demanda demanda = buscarPorId(id);

        switch (acao.toLowerCase()) {
            case "atender": // antiga "iniciar"
                if (demanda.getStatus().equals("Aberta") || demanda.getStatus().equals("Não Concluída")) {
                    demanda.setStatus("Em Andamento");
                } else {
                    throw new DemandaException.DemandaForbiddenException(
                            "Só é possível atender uma demanda que está Aberta ou Não Concluída");
                }
                break;

            case "finalizar":
                if (!demanda.getStatus().equals("Em Andamento")) {
                    throw new DemandaException.DemandaForbiddenException(
                            "Só é possível finalizar uma demanda que está Em Andamento");
                }
                demanda.setStatus("Concluída");
                break;

            case "cancelar":
                if (!demanda.getStatus().equals("Aberta")) {
                    throw new DemandaException.DemandaForbiddenException(
                            "Só é possível cancelar uma demanda que está Aberta");
                }
                demanda.setStatus("Cancelada");
                break;

            case "nao_concluida":
                if (!demanda.getStatus().equals("Em Andamento")) {
                    throw new DemandaException.DemandaForbiddenException(
                            "Só é possível marcar como não concluída uma demanda que está Em Andamento");
                }
                demanda.setStatus("Não Concluída");
                break;

            default:
                throw new DemandaException.DemandaForbiddenException("Ação de status inválida");
        }

        // Salvar alteração do status
        Demanda atualizado = demandaRepository.save(demanda);
        return ResponseEntity.ok(ApiResponse.success("Status da demanda alterado com sucesso!", atualizado));
    }


    public ResponseEntity<ApiResponse<Void>> excluir(Long id) {
        demandaRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Demanda excluída com sucesso!", null));
    }

    // -------------------- Métodos auxiliares --------------------
    public boolean existePorTitulo(String titulo) {
        return demandaRepository.existsByTitulo(titulo);
    }
}
