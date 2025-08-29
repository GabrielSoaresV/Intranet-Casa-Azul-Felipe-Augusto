package com.projetoavaliacao.service;

import com.projetoavaliacao.dto.EmailJovemDTO;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    // Recebe o DTO e envia email usando template HTML
    public void sendEmail(EmailJovemDTO dto) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("noreply@gmail.com");
            helper.setTo(dto.getEmailDestino());
            helper.setSubject("Formulário de Avaliação");

            // Cria o contexto Thymeleaf com apenas os dados necessários
            Context context = new Context();
            context.setVariable("nomeJovem", dto.getNomeJovem());
            context.setVariable("telefoneUsuario", dto.getTelefoneUsuario());
            context.setVariable("nomeUsuario", dto.getNomeUsuario());
            context.setVariable("nomeOrientador", dto.getNomeOrientador());

            // Processa o template HTML
            String htmlContent = templateEngine.process("email-avaliacao", context);
            helper.setText(htmlContent, true); // true = HTML

            // Envia o email
            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar email", e);
        }
    }
}
