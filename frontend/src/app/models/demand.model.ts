// src/app/models/demand.model.ts
import { Profile } from './profile.model';

export interface Demand {
  id?: string;
  creator: Profile;
  assignedUser?: Profile;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RETURNED' | 'COMPLETED' | 'CANCELLED' | 'DELETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  category?: string;
  createdBy?: Profile;
  updatedBy?: Profile;
  createdAt: string;
  updatedAt?: string;
}
