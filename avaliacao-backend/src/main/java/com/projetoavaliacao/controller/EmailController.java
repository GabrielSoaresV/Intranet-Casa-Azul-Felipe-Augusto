package com.projetoavaliacao.controller;

import com.projetoavaliacao.model.Email;
import com.projetoavaliacao.model.Empresa;
import com.projetoavaliacao.model.JovemAprendiz;
import com.projetoavaliacao.repository.EmpresaRepository;
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

    public EmailController(EmailService emailService, JovemRepository jovemRepository, EmpresaRepository empresaRepository) {
        this.emailService = emailService;
        this.jovemRepository = jovemRepository;
    }

    @PostMapping("/{matricula}")
    public ResponseEntity<String> enviarEmail(@PathVariable String matricula) {
        JovemAprendiz jovem = jovemRepository.findById(matricula)
                .orElseThrow(() -> new RuntimeException("Jovem não encontrado"));

        Empresa empresa = jovem.getEmpresa();
        if (empresa == null) {
            throw new RuntimeException("Empresa não encontrada para este jovem");
        }

        Email email = new Email(
                empresa.getEmailEmpresa(),    // destinatário
                "Formulário de Avaliação",
                "Mensagem opcional"
        );

        emailService.sendEmail(
                email,
                jovem.getNome(),
                jovem.getTelefone(),
                jovem.getNomeresponsavel(),           // remetente ou usuário
                empresa.getRhNomeResponsavel()        // nomeOrientador
        );

        return ResponseEntity.ok("Email enviado com sucesso para " + empresa.getEmailEmpresa());
    }
}
