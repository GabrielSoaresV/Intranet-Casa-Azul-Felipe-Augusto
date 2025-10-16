import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Profile } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private supabase: SupabaseService) {}

  async getCurrentProfile(): Promise<Profile | null> {
    const user = this.supabase.getCurrentUser();
    if (!user) return null;

    const { data, error } = await this.supabase.client
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const user = this.supabase.getCurrentUser();
    const { data, error } = await this.supabase.client
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user?.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await this.supabase.client
      .from('profiles')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }
}
