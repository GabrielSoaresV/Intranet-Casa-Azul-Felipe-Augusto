package dev.gabriel.authservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // Caminho fixo baseado no diretório REAL do projeto
        Path baseDir = Paths.get("").toAbsolutePath();

        Path uploadsDir = baseDir.resolve("auth-service").resolve("uploads");

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadsDir.toString() + "/");
    }
}
