package com.controle.demandas.api.model;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import java.time.Instant;

@Entity
@Table(name = "demand_history")
public class DemandHistory {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;

    // 🔹 ID da demanda associada ao histórico
    @Column(name = "demand_id", nullable = false)
    private String demandId;

    // Usuário principal relacionado à demanda (ex: criador ou atendente)
    @ManyToOne
    @JoinColumn(name = "user_cpf")
    private Profile user;

    // Usuário que executou a ação (pode ser o mesmo ou outro)
    @ManyToOne
    @JoinColumn(name = "performed_by_cpf")
    private Profile performedBy;

    // Tipo de ação
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Action action;

    // Status anterior e novo
    @Enumerated(EnumType.STRING)
    private Demand.Status oldStatus;

    @Enumerated(EnumType.STRING)
    private Demand.Status newStatus;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public enum Action {
        CREATED,
        UPDATED,
        ASSIGNED,
        COMPLETED,
        DELETED,
        CANCELLED
    }

    // Getters e Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDemandId() { return demandId; }
    public void setDemandId(String demandId) { this.demandId = demandId; }

    public Profile getUser() { return user; }
    public void setUser(Profile user) { this.user = user; }

    public Profile getPerformedBy() { return performedBy; }
    public void setPerformedBy(Profile performedBy) { this.performedBy = performedBy; }

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
}
