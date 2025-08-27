package com.projetoavaliacao.controller;

import com.projetoavaliacao.model.Email;
import com.projetoavaliacao.service.EmailService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emails")
@CrossOrigin(origins = "http://localhost:4200") // permite chamadas do Angular
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping
    public void sendEmail(@RequestBody Email email) {
        emailService.sendEmail(email);
    }
}
