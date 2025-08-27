package com.projetoavaliacao.controller;

import com.projetoavaliacao.model.Email;
import com.projetoavaliacao.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emails")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<String> sendEmail(@RequestBody Email email) {
        emailService.sendEmail(email);
        return ResponseEntity.ok("Email enviado com sucesso!");
    }
}
