import { Demand } from './demand.model';
import { Profile } from './profile.model';

export interface DemandHistory {
  id?: string;
  demand: Demand;
  user?: Profile;
  performedBy?: Profile;
  action: 'CREATED' | 'UPDATED' | 'ASSIGNED' | 'COMPLETED' | 'CANCELLED';
  oldStatus?: Demand['status'];
  newStatus?: Demand['status'];
  notes?: string;
  createdAt?: string;
}
