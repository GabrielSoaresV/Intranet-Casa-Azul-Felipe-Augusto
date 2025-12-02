package com.projetoavaliacao.service;

import com.projetoavaliacao.model.Empresa;
import com.projetoavaliacao.repository.EmpresaRepository;
import com.projetoavaliacao.repository.JovemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmpresaService {

    private final EmpresaRepository repo;
    private final JovemRepository jovemRepo;

    public EmpresaService(EmpresaRepository repo, JovemRepository jovemRepo) {
        this.repo = repo;
        this.jovemRepo = jovemRepo;
    }

    // Listar todas
    public List<Empresa> listarTodas() {
        return repo.findAll();
    }

    // Criar nova empresa
    public Empresa salvar(Empresa empresa) {
        return repo.save(empresa);
    }

    // Buscar por CNPJ
    public Empresa buscarPorCnpj(String cnpj) {
        return repo.findById(cnpj).orElse(null);
    }

    // Atualizar empresa
    public Empresa atualizar(String cnpj, Empresa dados) {
        return repo.findById(cnpj)
                .map(empresa -> {
                    empresa.setNomeEmpresa(dados.getNomeEmpresa());
                    empresa.setEmailEmpresa(dados.getEmailEmpresa());
                    empresa.setTelefoneEmpresa(dados.getTelefoneEmpresa());
                    empresa.setRhNomeResponsavel(dados.getRhNomeResponsavel());
                    empresa.setRhEmailResponsavel(dados.getRhEmailResponsavel());
                    return repo.save(empresa);
                })
                .orElse(null);
    }

    // Excluir empresa + jovens vinculados
    @Transactional
    public boolean excluir(String cnpj) {

        if (!repo.existsById(cnpj)) {
            return false;
        }

        // 🔥 Exclui todos os jovens dessa empresa
        jovemRepo.deleteByEmpresaCnpj(cnpj);

        // 🔥 Agora pode excluir a empresa
        repo.deleteById(cnpj);

        return true;
    }
}
