package dev.gabriel.authservice.service;

import dev.gabriel.authservice.dto.*;
import dev.gabriel.authservice.entity.User;
import dev.gabriel.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse login(AuthRequest request) {

        User user = findUserByIdentifier(request.getUserlogin());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword())
        );

        String access = jwtService.generateAccessToken(user);
        String refresh = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(access, refresh, "Bearer");
    }

    private User findUserByIdentifier(String identifier) {

        var userOpt = userRepository.findByUsername(identifier);
        if (userOpt.isPresent()) return userOpt.get();

        userOpt = userRepository.findByEmail(identifier);
        if (userOpt.isPresent()) return userOpt.get();

        userOpt = userRepository.findByCpf(identifier);
        if (userOpt.isPresent()) return userOpt.get();

        throw new RuntimeException("Usuário não encontrado: " + identifier);
    }

    public AuthResponse refreshToken(String refreshToken) {

        var token = refreshTokenService.validateRefreshToken(refreshToken);
        User user = token.getUser();

        String access = jwtService.generateAccessToken(user);
        String newRefresh = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(access, newRefresh, "Bearer");
    }

    public String logout() {

        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getPrincipal() == null || auth.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("Usuário não autenticado.");
        }

        User user = (User) auth.getPrincipal();

        refreshTokenService.deleteAllByUser(user);
        SecurityContextHolder.clearContext();

        return "Logout realizado com sucesso!";
    }
}
