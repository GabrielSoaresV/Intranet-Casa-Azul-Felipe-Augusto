package com.controle.demandas.api.model;

import jakarta.persistence.*;
import java.time.Instant;

import org.hibernate.annotations.GenericGenerator;

@Entity
public class DemandHistory {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;

    @ManyToOne
    private Demand demand;

    @ManyToOne
    private Profile user;

    @Enumerated(EnumType.STRING)
    private Action action;

    @Enumerated(EnumType.STRING)
    private Demand.Status oldStatus;

    @Enumerated(EnumType.STRING)
    private Demand.Status newStatus;

    private String notes;
    private Instant createdAt;

    // getters e setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Demand getDemand() { return demand; }
    public void setDemand(Demand demand) { this.demand = demand; }

    public Profile getUser() { return user; }
    public void setUser(Profile user) { this.user = user; }

    public Action getAction() { return action; }
    public void setAction(Action action) { this.action = action; }

    public Demand.Status getOldStatus() { return oldStatus; }
    public void setOldStatus(Demand.Status oldStatus) { this.oldStatus = oldStatus; }

    public Demand.Status getNewStatus() { return newStatus; }
    public void setNewStatus(Demand.Status newStatus) { this.newStatus = newStatus; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public enum Action {
        CREATED,
        UPDATED,
        ASSIGNED,
        COMPLETED,
        CANCELLED
    }
}
