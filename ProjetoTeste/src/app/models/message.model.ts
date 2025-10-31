import { Demand } from './demand.model';
import { Profile } from './profile.model';

export interface Message {
  id?: string;
  demand: Demand;
  user: Profile;
  message: string;
  createdAt?: string;
}
