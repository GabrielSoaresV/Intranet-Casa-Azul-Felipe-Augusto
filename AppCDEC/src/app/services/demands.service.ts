// DemandsService.mock.ts
import { Injectable } from '@angular/core';
import { Demand, DemandHistory } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class DemandsService {
  async getAllDemands(): Promise<Demand[]> {
    console.log('DemandsService.getAllDemands chamado');
    return [];
  }

  async getDemandById(id: string): Promise<Demand | null> {
    console.log('DemandsService.getDemandById chamado', id);
    return null;
  }

  async getDemandsByCitizen(citizenId: string): Promise<Demand[]> {
    console.log('DemandsService.getDemandsByCitizen chamado', citizenId);
    return [];
  }

  async createDemand(demand: Omit<Demand, 'id' | 'created_at' | 'updated_at'>): Promise<Demand> {
    console.log('DemandsService.createDemand chamado', demand);
    return {} as Demand;
  }

  async updateDemandStatus(id: string, newStatus: string, notes?: string): Promise<Demand> {
    console.log('DemandsService.updateDemandStatus chamado', id, newStatus, notes);
    return {} as Demand;
  }

  async assignDemand(id: string, userId: string): Promise<Demand> {
    console.log('DemandsService.assignDemand chamado', id, userId);
    return {} as Demand;
  }

  async createHistory(demandId: string, action: string, oldStatus: string | null | undefined, newStatus: string | null | undefined, notes?: string): Promise<void> {
    console.log('DemandsService.createHistory chamado', demandId, action, oldStatus, newStatus, notes);
  }

  async getDemandHistory(demandId: string): Promise<DemandHistory[]> {
    console.log('DemandsService.getDemandHistory chamado', demandId);
    return [];
  }
}
