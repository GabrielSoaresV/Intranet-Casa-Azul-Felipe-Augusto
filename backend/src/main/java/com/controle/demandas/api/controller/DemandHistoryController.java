package com.controle.demandas.api.controller;

import com.controle.demandas.api.model.DemandHistory;
import com.controle.demandas.api.service.DemandHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class DemandHistoryController {

    @Autowired
    private DemandHistoryService historyService;

    @GetMapping("/demand/{demandId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DemandHistory>> getByDemand(@PathVariable String demandId) {
        return ResponseEntity.ok(historyService.getHistoryByDemand(demandId));
    }
}
