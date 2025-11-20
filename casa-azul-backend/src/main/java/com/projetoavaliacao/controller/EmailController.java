package com.projetoavaliacao.controller;

import com.projetoavaliacao.dto.EmailJovemDTO;
import com.projetoavaliacao.model.Empresa;
import com.projetoavaliacao.model.JovemAprendiz;
import com.projetoavaliacao.repository.JovemRepository;
import com.projetoavaliacao.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
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

        // 1️⃣ Busca o jovem no banco pelo ID/matricula
        JovemAprendiz jovem = jovemRepository.findById(matricula)
                .orElseThrow(() -> new RuntimeException("Jovem não encontrado"));

        // 2️⃣ Pega a empresa associada ao jovem
        Empresa empresa = jovem.getEmpresa();
        if (empresa == null) {
            throw new RuntimeException("Empresa não encontrada para este jovem");
        }

        // 3️⃣ Monta o DTO com apenas os dados necessários
        EmailJovemDTO dto = new EmailJovemDTO(
                jovem.getNome(),                  // Nome do aprendiz
                jovem.getTelefone(),              // Telefone do aprendiz
                jovem.getNomeresponsavel(),       // Nome do usuário/remetente
                empresa.getRhNomeResponsavel(),   // Nome do orientador (RH)
                empresa.getEmailEmpresa()         // Email destino (empresa)
        );

        // 4️⃣ Chama o service passando o DTO
        emailService.sendEmail(dto);

        return ResponseEntity.noContent().build();
    }
}
