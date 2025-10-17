package com.controle.demandas.api.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    // 🔹 Gera uma chave segura de 256 bits para HS256
    private final SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    private final long EXPIRATION_TIME = 86400000; // 24h

    public String generateToken(String cpf, String role) {
        return Jwts.builder()
                .setSubject(cpf)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key) // usa a chave segura
                .compact();
    }

    // 🔹 Getter para a chave, caso precise validar tokens em outro lugar
    public SecretKey getKey() {
        return key;
    }
}
