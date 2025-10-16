import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Demand, DemandHistory } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class DemandsService {
  constructor(private supabase: SupabaseService) {}

  async getAllDemands(): Promise<Demand[]> {
    const { data, error } = await this.supabase.client
      .from('demands')
      .select(`
        *,
        citizen:citizens(*),
        assigned_user:profiles(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getDemandById(id: string): Promise<Demand | null> {
    const { data, error } = await this.supabase.client
      .from('demands')
      .select(`
        *,
        citizen:citizens(*),
        assigned_user:profiles(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getDemandsByCitizen(citizenId: string): Promise<Demand[]> {
    const { data, error } = await this.supabase.client
      .from('demands')
      .select(`
        *,
        citizen:citizens(*),
        assigned_user:profiles(*)
      `)
      .eq('citizen_id', citizenId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createDemand(demand: Omit<Demand, 'id' | 'created_at' | 'updated_at'>): Promise<Demand> {
    const user = this.supabase.getCurrentUser();
    const { data, error } = await this.supabase.client
      .from('demands')
      .insert({
        ...demand,
        created_by: user?.id
      })
      .select()
      .single();

    if (error) throw error;

    await this.createHistory(data.id, 'created', null, data.status, 'Demanda criada');

    return data;
  }

  async updateDemandStatus(id: string, newStatus: string, notes?: string): Promise<Demand> {
    const demand = await this.getDemandById(id);
    const oldStatus = demand?.status;

    const { data, error } = await this.supabase.client
      .from('demands')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    let action: 'updated' | 'completed' | 'cancelled' = 'updated';
    if (newStatus === 'completed') action = 'completed';
    if (newStatus === 'cancelled') action = 'cancelled';

    await this.createHistory(id, action, oldStatus, newStatus, notes);

    return data;
  }

  async assignDemand(id: string, userId: string): Promise<Demand> {
    const { data, error } = await this.supabase.client
      .from('demands')
      .update({ assigned_to: userId, status: 'in_progress', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await this.createHistory(id, 'assigned', null, null, `Atribuído ao usuário ${userId}`);

    return data;
  }

  async createHistory(
    demandId: string,
    action: string,
    oldStatus: string | null | undefined,
    newStatus: string | null | undefined,
    notes?: string
  ): Promise<void> {
    const user = this.supabase.getCurrentUser();
    await this.supabase.client
      .from('demand_history')
      .insert({
        demand_id: demandId,
        user_id: user?.id,
        action,
        old_status: oldStatus,
        new_status: newStatus,
        notes
      });
  }

  async getDemandHistory(demandId: string): Promise<DemandHistory[]> {
    const { data, error } = await this.supabase.client
      .from('demand_history')
      .select(`
        *,
        user:profiles(*)
      `)
      .eq('demand_id', demandId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
