package com.controle.demandas.api.model;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import java.time.Instant;

@Entity
@Table(name = "demands")
public class Demand {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;

    // 🔹 Agora, quem cria a demanda é um Profile (ex-citizen)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "creator_cpf", referencedColumnName = "cpf")
    private Profile creator;

    // 🔹 Quem atende a demanda (funcionário, atendente, etc.)
    @ManyToOne
    @JoinColumn(name = "assigned_user_cpf", referencedColumnName = "cpf")
    private Profile assignedUser;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;

    private String category;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private Profile createdBy;

    @ManyToOne
    @JoinColumn(name = "updated_by_id")
    private Profile updatedBy;

    // 🔹 Enum de status
    public enum Status {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }

    // 🔹 Enum de prioridade
    public enum Priority {
        LOW,
        MEDIUM,
        HIGH
    }

    // Getters e setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Profile getCreator() { return creator; }
    public void setCreator(Profile creator) { this.creator = creator; }

    public Profile getAssignedUser() { return assignedUser; }
    public void setAssignedUser(Profile assignedUser) { this.assignedUser = assignedUser; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public Profile getCreatedBy() { return createdBy; }
    public void setCreatedBy(Profile createdBy) { this.createdBy = createdBy; }

    @PrePersist
    public void prePersist() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}
