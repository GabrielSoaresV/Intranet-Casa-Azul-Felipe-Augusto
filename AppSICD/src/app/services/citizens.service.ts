import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Citizen } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class CitizensService {
  constructor(private supabase: SupabaseService) {}

  async getAllCitizens(): Promise<Citizen[]> {
    const { data, error } = await this.supabase.client
      .from('citizens')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getCitizenById(id: string): Promise<Citizen | null> {
    const { data, error } = await this.supabase.client
      .from('citizens')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createCitizen(citizen: Omit<Citizen, 'id' | 'created_at'>): Promise<Citizen> {
    const user = this.supabase.getCurrentUser();
    const { data, error } = await this.supabase.client
      .from('citizens')
      .insert({
        ...citizen,
        created_by: user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCitizen(id: string, updates: Partial<Citizen>): Promise<Citizen> {
    const { data, error } = await this.supabase.client
      .from('citizens')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteCitizen(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('citizens')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
