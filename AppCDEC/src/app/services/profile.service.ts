// ProfileService.mock.ts
import { Injectable } from '@angular/core';
import { Profile } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  async getCurrentProfile(): Promise<Profile | null> {
    console.log('ProfileService.getCurrentProfile chamado');
    return null;
  }

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    console.log('ProfileService.updateProfile chamado', updates);
    return {} as Profile;
  }

  async getAllProfiles(): Promise<Profile[]> {
    console.log('ProfileService.getAllProfiles chamado');
    return [];
  }
}
