package dev.gabriel.authservice.service;

import dev.gabriel.authservice.entity.RefreshToken;
import dev.gabriel.authservice.entity.User;
import dev.gabriel.authservice.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    @Transactional
    public String createRefreshToken(User user) {

        refreshTokenRepository.deleteByUserId(user.getId());

        String value = jwtService.generateRefreshToken(user);

        RefreshToken token = RefreshToken.builder()
                .token(value)
                .user(user)
                .expiryDate(Instant.now().plusMillis(86400000))
                .build();

        refreshTokenRepository.save(token);
        return value;
    }

    public RefreshToken validateRefreshToken(String refreshToken) {

        RefreshToken token = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Refresh token inválido."));

        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token expirado. Faça login novamente.");
        }

        return token;
    }

    @Transactional
    public void deleteAllByUser(User user) {
        refreshTokenRepository.deleteByUserId(user.getId());
    }
}
