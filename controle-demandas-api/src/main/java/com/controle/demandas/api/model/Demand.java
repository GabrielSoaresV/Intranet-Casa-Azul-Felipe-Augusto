package com.controle.demandas.api.model;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import java.time.Instant;

@Entity
public class Demand {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;

    @ManyToOne(optional = false)
    private Citizen citizen;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;

    private String category;

    @ManyToOne
    private Profile assignedUser;

    @ManyToOne(optional = false)
    private Profile createdBy;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    // getters e setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Citizen getCitizen() { return citizen; }
    public void setCitizen(Citizen citizen) { this.citizen = citizen; }

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

    public Profile getAssignedUser() { return assignedUser; }
    public void setAssignedUser(Profile assignedUser) { this.assignedUser = assignedUser; }

    public Profile getCreatedBy() { return createdBy; }
    public void setCreatedBy(Profile createdBy) { this.createdBy = createdBy; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public enum Status {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }

    public enum Priority {
        LOW,
        MEDIUM,
        HIGH
    }
}
