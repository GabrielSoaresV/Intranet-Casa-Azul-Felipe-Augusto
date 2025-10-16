package com.controle.demandas.api.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
public class Message {

    @Id
    private String id;

    @ManyToOne
    private Demand demand;

    @ManyToOne
    private Profile user;

    private String message;
    private Instant createdAt;

    // getters e setters
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
