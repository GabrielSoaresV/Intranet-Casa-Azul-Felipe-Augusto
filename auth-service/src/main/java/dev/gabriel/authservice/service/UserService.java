package dev.gabriel.authservice.service;

import dev.gabriel.authservice.dto.AuthResponse;
import dev.gabriel.authservice.dto.ChangePasswordRequest;
import dev.gabriel.authservice.dto.RegisterRequest;
import dev.gabriel.authservice.dto.UpdateUserRequest;
import dev.gabriel.authservice.dto.UserDetailsResponse;
import dev.gabriel.authservice.dto.UserResponse;
import dev.gabriel.authservice.entity.Role;
import dev.gabriel.authservice.entity.User;
import dev.gabriel.authservice.exception.InvalidFileTypeException;
import dev.gabriel.authservice.repository.RoleRepository;
import dev.gabriel.authservice.repository.UserRepository;
import dev.gabriel.authservice.util.CpfValidator;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.Objects;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.nio.file.Path;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse registerUser(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Nome de usuário já está em uso.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("E-mail já está em uso.");
        }

        String cpf = CpfValidator.normalize(request.getCpf());

        if (!CpfValidator.isValidCPF(cpf)) {
            throw new RuntimeException("CPF inválido.");
        }

        if (userRepository.existsByCpf(cpf)) {
            throw new RuntimeException("CPF já está em uso.");
        }

        Role defaultRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("ROLE_USER não existe no banco!"));

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .cpf(cpf)
                .enabled(true)
                .build();

        user.getRoles().add(defaultRole);
        userRepository.save(user);

        String access = jwtService.generateAccessToken(user);
        String refresh = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(access, refresh, "Bearer");
    }

    @Transactional
    public String updateUser(UpdateUserRequest request) {

        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getPrincipal() == null || auth.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("Usuário não autenticado.");
        }

        User user = (User) auth.getPrincipal();
        boolean changed = false;

        // ============================
        // 1️⃣ Atualizar Username
        // ============================
        if (request.getUsername() != null && !request.getUsername().isBlank()
                && !request.getUsername().equals(user.getUsername())) {

            if (userRepository.existsByUsername(request.getUsername())) {
                throw new RuntimeException("Nome de usuário já está em uso.");
            }

            user.setUsername(request.getUsername());
            changed = true;
        }

        // ============================
        // 2️⃣ Atualizar Email
        // ============================
        if (request.getEmail() != null && !request.getEmail().isBlank()
                && !request.getEmail().equals(user.getEmail())) {

            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("E-mail já está em uso.");
            }

            user.setEmail(request.getEmail());
            changed = true;
        }

        // ============================
        // 3️⃣ Atualizar CPF (com validação forte)
        // ============================
        if (request.getCpf() != null && !request.getCpf().isBlank()) {

            // Remove tudo que não é número
            String cpf = request.getCpf().replaceAll("[^0-9]", "");

            if (cpf.length() != 11) {
                throw new RuntimeException("CPF deve conter exatamente 11 dígitos numéricos.");
            }

            if (!CpfValidator.isValidCPF(cpf)) {
                throw new RuntimeException("CPF inválido.");
            }

            if (!cpf.equals(user.getCpf())) {
                if (userRepository.existsByCpf(cpf)) {
                    throw new RuntimeException("CPF já está em uso.");
                }

                user.setCpf(cpf);
                changed = true;
            }
        }

        // ==================================
        // Nada mudou
        // ==================================
        if (!changed) {
            return "Nenhuma alteração foi realizada.";
        }

        userRepository.save(user);
        return "Dados atualizados com sucesso!";
    }

    public UserResponse getCurrentUser() {

        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getPrincipal() == null || auth.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("Usuário não autenticado.");
        }

        User user = (User) auth.getPrincipal();

        String image = (user.getProfileImage() == null || user.getProfileImage().isEmpty())
                ? "/uploads/profile/default.png"
                : user.getProfileImage();

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .profileImage(image)
                .roles(
                        user.getRoles().stream()
                                .map(Role::getName)
                                .collect(java.util.stream.Collectors.toSet())
                )
                .build();
    }


    public String changePassword(ChangePasswordRequest request) {

        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getPrincipal() == null || auth.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("Usuário não autenticado.");
        }

        User user = (User) auth.getPrincipal();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Senha atual incorreta.");
        }

        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new RuntimeException("A nova senha e a confirmação não coincidem.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        refreshTokenService.deleteAllByUser(user);

        return "Senha alterada com sucesso!";
    }

    public List<UserDetailsResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> {

                    String image = (user.getProfileImage() == null || user.getProfileImage().isEmpty())
                            ? "/uploads/profile/default.png"
                            : user.getProfileImage();

                    return UserDetailsResponse.builder()
                            .id(user.getId())
                            .username(user.getUsername())
                            .cpf(user.getCpf())
                            .email(user.getEmail())
                            .profileImage(image)
                            .enabled(user.isEnabled())
                            .roles(
                                    user.getRoles().stream()
                                            .map(Role::getName)
                                            .collect(java.util.stream.Collectors.toSet())
                            )
                            .build();
                }).toList();
    }


    public UserDetailsResponse getUserDetails(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + username));

        String image = (user.getProfileImage() == null || user.getProfileImage().isEmpty())
                ? "/uploads/profile/default.png"
                : user.getProfileImage();

        return UserDetailsResponse.builder()
                .id(user.getId())
                .cpf(user.getCpf())
                .username(user.getUsername())
                .email(user.getEmail())
                .profileImage(image)
                .enabled(user.isEnabled())
                .roles(
                        user.getRoles().stream()
                                .map(Role::getName)
                                .collect(java.util.stream.Collectors.toSet())
                )
                .build();
    }


    public String uploadProfileImage(Long userId, MultipartFile file) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // valida tipo
        String contentType = file.getContentType();
        if (contentType == null ||
                !(contentType.equals("image/jpeg") ||
                contentType.equals("image/png") ||
                contentType.equals("image/gif"))) {

            throw new InvalidFileTypeException("Apenas JPEG, PNG ou GIF são permitidos.");
        }

        try {
            // Caminho absoluto da pasta
            Path uploadFolder = Paths.get(System.getProperty("user.dir"), "auth-service", "uploads", "profile");
            Files.createDirectories(uploadFolder);

            // extensão
            String extension = Objects.requireNonNull(file.getOriginalFilename())
                    .substring(file.getOriginalFilename().lastIndexOf('.') + 1)
                    .toLowerCase();

            // nome fixo pelo id
            String fileName = userId + "." + extension;
            Path finalPath = uploadFolder.resolve(fileName);

            Files.copy(file.getInputStream(), finalPath, StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "/uploads/profile/" + fileName;

            user.setProfileImage(imageUrl);
            userRepository.save(user);

            return imageUrl;

        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar imagem", e);
        }
    }

    public String deleteProfileImage(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // se não tem foto customizada
        if (user.getProfileImage() == null || user.getProfileImage().isEmpty()) {
            return "/uploads/profile/default.png";
        }

        try {
            // caminho que guarda as fotos
            Path uploadFolder = Paths.get(System.getProperty("user.dir"), "auth-service", "uploads", "profile");

            // extrai o nome do arquivo armazenado
            String fileName = user.getProfileImage().replace("/uploads/profile/", "");

            Path filePath = uploadFolder.resolve(fileName);

            // apaga arquivo físico, se existir
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }

            // volta ao default
            user.setProfileImage("/uploads/profile/default.png");
            userRepository.save(user);

            return "/uploads/profile/default.png";

        } catch (IOException e) {
            throw new RuntimeException("Erro ao deletar imagem", e);
        }
    }

    @Transactional
    public String updateEnabledStatus(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        user.setEnabled(enabled);
        userRepository.save(user);

        return enabled ? "Usuário reativado com sucesso!" : "Usuário desativado com sucesso!";
    }

    @Transactional
    public String disableUser(Long userId) {
        return updateEnabledStatus(userId, false);
    }

    @Transactional
    public String enableUser(Long userId) {
        return updateEnabledStatus(userId, true);
    }

}
