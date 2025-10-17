package com.controle.demandas.api.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
public class Citizen {

    @Id
    private String cpf;
    
    private String name;
    private String email;
    private String phone;

    @ManyToOne
    private Profile createdBy;

    @PrePersist
    public void prePersist() {
        if (this.cpf == null) {
            this.cpf = UUID.randomUUID().toString();
        }
    }

    // getters e setters
    public String getId() { return cpf; }
    public void setId(String id) { this.cpf = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Profile getCreatedBy() { return createdBy; }
    public void setCreatedBy(Profile createdBy) { this.createdBy = createdBy; }
}
