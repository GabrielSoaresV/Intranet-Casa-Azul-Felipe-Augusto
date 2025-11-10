package com.controle.demandas.api.model;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "demands")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Demand {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;

    // 🔹 Quem criou a demanda
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "creator_cpf", referencedColumnName = "cpf")
    private Profile creator;

    // 🔹 Quem foi designado para atender a demanda
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_user_cpf", referencedColumnName = "cpf")
    @JsonIgnoreProperties({"demands", "hibernateLazyInitializer", "handler"})
    private Profile assignedUser;

    private String title;
    @Column(length = 2000)
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

    // 🔹 Relacionamento com mensagens (chat)
    @OneToMany(mappedBy = "demand", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"demand"}) // evita loop: Demand -> Message -> Demand
    private List<Message> messages = new ArrayList<>();

    // 🔹 Enum de status
    public enum Status {
        PENDING,
        IN_PROGRESS,
        RETURNED,  
        COMPLETED,
        CANCELLED
    }

    // 🔹 Enum de prioridade
    public enum Priority {
        LOW,
        MEDIUM,
        HIGH
    }

    // 🔹 Getters e Setters
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

    public Profile getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(Profile updatedBy) { this.updatedBy = updatedBy; }

    public List<Message> getMessages() { return messages; }
    public void setMessages(List<Message> messages) { this.messages = messages; }

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
