package dev.gabriel.authservice.controller;

import dev.gabriel.authservice.dto.AuthResponse;
import dev.gabriel.authservice.dto.ChangePasswordRequest;
import dev.gabriel.authservice.dto.RegisterRequest;
import dev.gabriel.authservice.dto.UpdateUserRequest;
import dev.gabriel.authservice.dto.UserDetailsResponse;
import dev.gabriel.authservice.dto.UserResponse;
import dev.gabriel.authservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public AuthResponse registerUser(@RequestBody RegisterRequest request) {
        return userService.registerUser(request);
    }

    @PutMapping("/update")
    public String updateUser(@RequestBody UpdateUserRequest request) {
        return userService.updateUser(request);
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser() {
        return userService.getCurrentUser();
    }

    @PostMapping("/change-password")
    public String changePassword(@RequestBody ChangePasswordRequest request) {
        return userService.changePassword(request);
    }

    @GetMapping
    public List<UserDetailsResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{username}")
    public UserDetailsResponse getUserDetails(@PathVariable String username) {
        return userService.getUserDetails(username);
    }

    @PostMapping(value = "/{userId}/upload-profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadProfileImage(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {

        String imageUrl = userService.uploadProfileImage(userId, file);

        return ResponseEntity.ok().body(
                Map.of("message", "Imagem enviada com sucesso!", "imageUrl", imageUrl)
        );
    }

    @DeleteMapping("/{userId}/delete-profile")
    public ResponseEntity<?> deleteProfileImage(@PathVariable Long userId) {

        String imageUrl = userService.deleteProfileImage(userId);

        return ResponseEntity.ok().body(
                Map.of("message", "Imagem removida com sucesso!", "imageUrl", imageUrl)
        );
    }

    @PatchMapping("/{userId}/enabled")
    public ResponseEntity<?> updateEnabledStatus(
            @PathVariable Long userId,
            @RequestBody Map<String, Boolean> body
    ) {
        String message = userService.updateEnabledStatus(userId, body.get("enabled"));
        return ResponseEntity.ok(Map.of("message", message));
    }

    @PostMapping("/{userId}/disable")
    public ResponseEntity<?> disableUser(@PathVariable Long userId) {
        String msg = userService.disableUser(userId);
        return ResponseEntity.ok(Map.of("message", msg));
    }

    @PostMapping("/{userId}/enable")
    public ResponseEntity<?> enableUser(@PathVariable Long userId) {
        String msg = userService.enableUser(userId);
        return ResponseEntity.ok(Map.of("message", msg));
    }

}
