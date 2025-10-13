package com.controle.demandas.api.service;

import com.controle.demandas.api.dtoDemandas.*;
import com.controle.demandas.api.exception.DemandaException;
import com.controle.demandas.api.model.Cidadao;
import com.controle.demandas.api.model.Demanda;
import com.controle.demandas.api.repository.DemandaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DemandaService {

    @Autowired
    private DemandaRepository demandaRepository;

    @Autowired
    private CidadaoService cidadaoService;

    public Demanda criarDemanda(DemandaCreateDTO dto) {
        Cidadao cidadao = cidadaoService.buscarPorCpfEntity(dto.getCpfCidadao());

        Demanda demanda = Demanda.builder()
                .titulo(dto.getTitulo())
                .descricao(dto.getDescricao())
                .status("Aberta")
                .cidadao(cidadao)
                .build();

        return demandaRepository.save(demanda);
    }

    public List<DemandaSearchDTO> listarTodasDemandas() {
        return demandaRepository.findAll().stream()
                .map(this::mapToSearchDTO)
                .collect(Collectors.toList());
    }

    public List<DemandaSearchDTO> listarPorCidadao(String cpf) {
        cidadaoService.buscarPorCpfEntity(cpf);
        return demandaRepository.findByCidadaoCpf(cpf).stream()
                .map(this::mapToSearchDTO)
                .collect(Collectors.toList());
    }

    public Demanda buscarPorIdEntity(Long id) {
        return demandaRepository.findById(id)
                .orElseThrow(() -> new DemandaException.DemandaNotFoundException("Demanda não encontrada"));
    }

    public DemandaSearchDTO buscarPorId(Long id) {
        return mapToSearchDTO(buscarPorIdEntity(id));
    }

    public Demanda atualizarDemanda(Long id, DemandaUpdateDTO dto) {
        Demanda demanda = buscarPorIdEntity(id);
        demanda.setTitulo(dto.getTitulo());
        demanda.setDescricao(dto.getDescricao());
        return demandaRepository.save(demanda);
    }

    public Demanda alterarStatus(Long id, DemandaStatusDTO dto) {
        Demanda demanda = buscarPorIdEntity(id);
        String acao = dto.getStatus().toLowerCase();

        switch (acao) {
            case "atender":
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

            case "devolver":
                if (!demanda.getStatus().equals("Em Andamento")) {
                    throw new DemandaException.DemandaForbiddenException(
                            "Só é possível devolver uma demanda que está Em Andamento");
                }
                demanda.setStatus("Não Concluída");
                break;

            default:
                throw new DemandaException.DemandaForbiddenException("Ação de status inválida");
        }

        return demandaRepository.save(demanda);
    }

    public void excluirDemanda(Long id) {
        Demanda existente = buscarPorIdEntity(id);
        demandaRepository.delete(existente);
    }

    public List<DemandaSearchDTO> filtrarDemanda(DemandaFilterDTO filter) {
        return demandaRepository.findAll().stream()
                .filter(d -> filter.getTitulo() == null || d.getTitulo().toLowerCase().contains(filter.getTitulo().toLowerCase()))
                .filter(d -> filter.getStatus() == null || d.getStatus().equalsIgnoreCase(filter.getStatus()))
                .filter(d -> filter.getCpfCidadao() == null || d.getCidadao().getCpf().equals(filter.getCpfCidadao()))
                .map(this::mapToSearchDTO)
                .collect(Collectors.toList());
    }

    public DemandaSearchDTO mapToSearchDTO(Demanda d) {
        return DemandaSearchDTO.builder()
                .id(d.getId())
                .titulo(d.getTitulo())
                .descricao(d.getDescricao())
                .status(d.getStatus())
                .cpfCidadao(d.getCidadao().getCpf())
                .build();
    }
}
