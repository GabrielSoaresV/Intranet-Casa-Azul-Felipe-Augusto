package com.projetoavaliacao.service;

import com.projetoavaliacao.dto.EmailJovemDTO;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    // Pega automaticamente o e-mail configurado no application.properties
    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    // Envia e-mail usando Gmail e template HTML
    public void sendEmail(EmailJovemDTO dto) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "Casa Azul - Sistema de Avaliação"); // Nome do remetente
            helper.setTo(dto.getEmailDestino());
            helper.setSubject("Formulário de Avaliação - Jovem Aprendiz");

            // Prepara as variáveis do template
            Context context = new Context();
            context.setVariable("nomeJovem", dto.getNomeJovem());
            context.setVariable("telefoneUsuario", dto.getTelefoneUsuario());
            context.setVariable("nomeUsuario", dto.getNomeUsuario());
            context.setVariable("nomeOrientador", dto.getNomeOrientador());

            // Renderiza o template HTML
            String htmlContent = templateEngine.process("email-avaliacao", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);

            System.out.println("✅ Email enviado com sucesso para: " + dto.getEmailDestino());

        } catch (Exception e) {
            throw new RuntimeException("❌ Erro ao enviar email: " + e.getMessage(), e);
        }
    }
}
