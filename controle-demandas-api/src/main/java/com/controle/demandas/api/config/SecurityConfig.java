package com.controle.demandas.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()          // Desativa CSRF
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()); // Libera todos os endpoints

        return http.build();
    }
}
