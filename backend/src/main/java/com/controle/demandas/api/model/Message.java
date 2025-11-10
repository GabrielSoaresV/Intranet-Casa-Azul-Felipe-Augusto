package com.controle.demandas.api.model;

import jakarta.persistence.*;
import java.time.Instant;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "message")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "demand_id", nullable = false)
    @JsonIgnoreProperties({"messages"})
    private Demand demand;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_cpf", referencedColumnName = "cpf", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Profile user;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Demand getDemand() { return demand; }
    public void setDemand(Demand demand) { this.demand = demand; }

    public Profile getUser() { return user; }
    public void setUser(Profile user) { this.user = user; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
