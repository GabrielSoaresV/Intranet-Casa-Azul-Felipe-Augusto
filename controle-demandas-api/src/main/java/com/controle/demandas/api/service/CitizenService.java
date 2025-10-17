package com.controle.demandas.api.service;

import com.controle.demandas.api.exception.NotFoundException;
import com.controle.demandas.api.model.Citizen;
import com.controle.demandas.api.repository.CitizenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CitizenService {

    @Autowired
    private CitizenRepository citizenRepository;

    public List<Citizen> listarTodos() {
        return citizenRepository.findAll();
    }

    public Citizen buscarPorId(String id) {
        return citizenRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cidadão não encontrado"));
    }

    public Citizen criar(Citizen citizen) {
        return citizenRepository.save(citizen);
    }

    public Citizen atualizar(String id, Citizen updates) {
        Citizen c = buscarPorId(id);
        c.setName(updates.getName());
        c.setEmail(updates.getEmail());
        c.setPhone(updates.getPhone());
        return citizenRepository.save(c);
    }

    public void deletar(String id) {
        citizenRepository.delete(buscarPorId(id));
    }
}
