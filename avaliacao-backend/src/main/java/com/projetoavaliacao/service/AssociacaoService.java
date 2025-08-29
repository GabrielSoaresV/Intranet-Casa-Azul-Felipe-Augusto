package com.projetoavaliacao.service;

import com.projetoavaliacao.dto.AssociacaoDTO;
import com.projetoavaliacao.repository.AssociacaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssociacaoService {

    private final AssociacaoRepository repository;

    public AssociacaoService(AssociacaoRepository repository) {
        this.repository = repository;
    }

    public List<AssociacaoDTO> listarTodasDTO() {
        return repository.findAll().stream().map(a -> {
            AssociacaoDTO dto = new AssociacaoDTO();
            dto.setId(a.getId());

            AssociacaoDTO.JovemDTO jovemDto = new AssociacaoDTO.JovemDTO();
            jovemDto.setMatricula(a.getJovem().getMatricula());
            jovemDto.setNome(a.getJovem().getNome());
            jovemDto.setEmail(a.getJovem().getEmail());
            jovemDto.setNomeEmpresa(a.getJovem().getNomeEmpresa());

            AssociacaoDTO.EmpresaDTO empresaDto = new AssociacaoDTO.EmpresaDTO();
            empresaDto.setCnpj(a.getJovem().getEmpresa().getCnpj());
            empresaDto.setRhNomeResponsavel(a.getJovem().getEmpresa().getRhNomeResponsavel());
            empresaDto.setRhEmailResponsavel(a.getJovem().getEmpresa().getRhEmailResponsavel());

            jovemDto.setEmpresa(empresaDto);
            dto.setJovem(jovemDto);

            AssociacaoDTO.AvaliacaoDTO avaliacaoDto = new AssociacaoDTO.AvaliacaoDTO();
            avaliacaoDto.setIdAvaliacao(a.getAvaliacao().getIdAvaliacao());
            avaliacaoDto.setAvaliacao(a.getAvaliacao().getAvaliacao());
            avaliacaoDto.setDataAvaliacao(a.getAvaliacao().getDataAvaliacao());
            avaliacaoDto.setNumeroAvaliacao(a.getAvaliacao().getNumeroAvaliacao());

            dto.setAvaliacao(avaliacaoDto);

            return dto;
        }).collect(Collectors.toList());
    }
}
