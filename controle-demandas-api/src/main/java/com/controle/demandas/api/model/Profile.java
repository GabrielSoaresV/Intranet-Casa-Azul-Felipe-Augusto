package com.controle.demandas.api.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
public class Profile {

    @Id
    private String id;

    private String name;
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String avatarUrl;
    private Instant createdAt;
    private Instant updatedAt;

    // getters e setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public enum Role {
        ADMIN,
        ATTENDANT
    }
}
