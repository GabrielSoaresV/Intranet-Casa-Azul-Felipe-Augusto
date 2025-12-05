package com.projetoavaliacao.controller;

import com.projetoavaliacao.dto.EmailJovemDTO;
import com.projetoavaliacao.model.Empresa;
import com.projetoavaliacao.model.JovemAprendiz;
import com.projetoavaliacao.repository.JovemRepository;
import com.projetoavaliacao.service.EmailService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/email")
public class EmailController {

    private final EmailService emailService;
    private final JovemRepository jovemRepository;

    public EmailController(EmailService emailService, JovemRepository jovemRepository) {
        this.emailService = emailService;
        this.jovemRepository = jovemRepository;
    }

    // Endpoint para enviar email pelo Angular, usando a matrícula do jovem
    @PostMapping("/{matricula}")
    public ResponseEntity<String> enviarEmail(@PathVariable String matricula) {

        JovemAprendiz jovem = jovemRepository.findById(matricula)
                .orElseThrow(() -> new RuntimeException("Jovem não encontrado"));

        Empresa empresa = jovem.getEmpresa();
        if (empresa == null) {
            throw new RuntimeException("Empresa não encontrada para este jovem");
        }

        // AGORA PEGA LISTA DE E-MAILS
        List<String> emailsDestino = empresa.getEmailEmpresa();
        if (emailsDestino == null || emailsDestino.isEmpty()) {
            throw new RuntimeException("A empresa não possui e-mails cadastrados");
        }

        EmailJovemDTO dto = new EmailJovemDTO(
                jovem.getNome(),
                jovem.getTelefone(),
                jovem.getNomeresponsavel(),
                empresa.getRhNomeResponsavel(),
                emailsDestino
        );

        emailService.sendEmail(dto);

        return ResponseEntity.noContent().build();
    }

}
