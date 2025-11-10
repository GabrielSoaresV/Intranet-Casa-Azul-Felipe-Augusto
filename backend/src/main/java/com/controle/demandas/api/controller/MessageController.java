package com.controle.demandas.api.controller;

import com.controle.demandas.api.model.Message;
import com.controle.demandas.api.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping("/demand/{demandId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Message>> getByDemand(@PathVariable String demandId) {
        return ResponseEntity.ok(messageService.getMessages(demandId));
    }

    @PostMapping("/demand/{demandId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Message> sendMessage(@PathVariable String demandId, @RequestBody Message msg) {
        return ResponseEntity.ok(
            messageService.sendMessage(demandId, msg.getUser().getCpf(), msg.getMessage())
        );
    }
}
