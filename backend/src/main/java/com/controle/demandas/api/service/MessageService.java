package com.controle.demandas.api.service;

import com.controle.demandas.api.model.Message;
import com.controle.demandas.api.model.Profile;
import com.controle.demandas.api.model.Demand;
import com.controle.demandas.api.repository.MessageRepository;
import com.controle.demandas.api.repository.ProfileRepository;
import com.controle.demandas.api.repository.DemandRepository;
import com.controle.demandas.api.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private DemandRepository demandRepository;

    public List<Message> getMessages(String demandId) {
        return messageRepository.findByDemandIdOrderByCreatedAtAsc(demandId);
    }

    public Message sendMessage(String demandId, String userId, String content) {
        Demand demand = demandRepository.findById(demandId)
                .orElseThrow(() -> new NotFoundException("Demanda não encontrada"));
        Profile user = profileRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        Message message = new Message();
        message.setDemand(demand);
        message.setUser(user);
        message.setMessage(content);
        message.setCreatedAt(Instant.now());

        return messageRepository.save(message);
    }
}
