import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Message } from '../models/types';
import { RealtimeChannel } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private channels: Map<string, RealtimeChannel> = new Map();

  constructor(private supabase: SupabaseService) {}

  async getMessages(demandId: string): Promise<Message[]> {
    const { data, error } = await this.supabase.client
      .from('messages')
      .select(`
        *,
        user:profiles(*)
      `)
      .eq('demand_id', demandId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async sendMessage(demandId: string, message: string): Promise<Message> {
    const user = this.supabase.getCurrentUser();
    const { data, error } = await this.supabase.client
      .from('messages')
      .insert({
        demand_id: demandId,
        user_id: user?.id,
        message
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  subscribeToMessages(demandId: string, callback: (message: Message) => void): void {
    const channelName = `messages:${demandId}`;

    if (this.channels.has(channelName)) {
      return;
    }

    const channel = this.supabase.client
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `demand_id=eq.${demandId}`
        },
        async (payload) => {
          const { data } = await this.supabase.client
            .from('messages')
            .select(`
              *,
              user:profiles(*)
            `)
            .eq('id', (payload.new as any)['id'])
            .single();

          if (data) {
            callback(data);
          }
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
  }

  unsubscribeFromMessages(demandId: string): void {
    const channelName = `messages:${demandId}`;
    const channel = this.channels.get(channelName);

    if (channel) {
      this.supabase.client.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }
}
