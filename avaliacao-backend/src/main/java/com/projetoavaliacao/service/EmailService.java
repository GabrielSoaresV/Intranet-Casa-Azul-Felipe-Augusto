package com.projetoavaliacao.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.projetoavaliacao.model.Email;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public void sendEmail(Email email, String nomeJovem, String telefoneUsuario, String nomeUsuario, String nomeOrientador) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("noreply@gmail.com");
            helper.setTo(email.to());
            helper.setSubject(email.subject());

            // Preenche variáveis do template
            Context context = new Context();
            context.setVariable("nomeJovem", nomeJovem);
            context.setVariable("telefoneUsuario", telefoneUsuario);
            context.setVariable("nomeUsuario", nomeUsuario);
            context.setVariable("nomeOrientador", nomeOrientador); 

            // Processa o HTML
            String htmlContent = templateEngine.process("email-avaliacao", context);

            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar email", e);
        }
    }

}
