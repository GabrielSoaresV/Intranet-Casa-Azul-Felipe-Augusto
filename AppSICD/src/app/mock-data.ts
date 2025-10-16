// mock-data.ts

import { Citizen, Demand, DemandHistory, Message, Profile } from "./models/types";


// ✅ Perfis de usuário
export const mockProfiles: Profile[] = [
  {
    id: 'u1',
    name: 'Gabriel',
    email: 'gabriel@test.com',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'u2',
    name: 'Ana',
    email: 'ana@test.com',
    role: 'attendant',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// ✅ Cidadãos
export const mockCitizens: Citizen[] = [
  {
    id: 'c1',
    name: 'João Silva',
    email: 'joao@test.com',
    cpf: '123.456.789-00',
    phone: '11999999999',
    address: 'Rua A, 123',
    created_at: new Date().toISOString(),
    created_by: 'u1'
  },
  {
    id: 'c2',
    name: 'Maria Souza',
    email: 'maria@test.com',
    cpf: '987.654.321-00',
    phone: '11988888888',
    address: 'Rua B, 456',
    created_at: new Date().toISOString(),
    created_by: 'u2'
  }
];

// ✅ Demandas
export const mockDemands: Demand[] = [
  {
    id: 'd1',
    citizen_id: 'c1',
    title: 'Problema com água',
    description: 'A água da residência não está funcionando',
    status: 'pending',
    priority: 'high',
    category: 'Serviços Públicos',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'u2',
    citizen: mockCitizens[0],
    assigned_user: mockProfiles[1]
  },
  {
    id: 'd2',
    citizen_id: 'c2',
    title: 'Luz com oscilação',
    description: 'A luz oscila constantemente',
    status: 'in_progress',
    priority: 'medium',
    category: 'Serviços Públicos',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'u1',
    citizen: mockCitizens[1],
    assigned_user: mockProfiles[0]
  }
];

// ✅ Mensagens
export const mockMessages: Message[] = [
  {
    id: 'm1',
    demand_id: 'd1',
    user_id: 'u1',
    message: 'Estamos verificando o problema.',
    created_at: new Date().toISOString(),
    user: mockProfiles[0]
  },
  {
    id: 'm2',
    demand_id: 'd2',
    user_id: 'u2',
    message: 'Técnico enviado para o local.',
    created_at: new Date().toISOString(),
    user: mockProfiles[1]
  }
];

// ✅ Histórico de demandas
export const mockDemandHistory: DemandHistory[] = [
  {
    id: 'h1',
    demand_id: 'd1',
    user_id: 'u2',
    action: 'created',
    created_at: new Date().toISOString(),
    user: mockProfiles[1]
  },
  {
    id: 'h2',
    demand_id: 'd2',
    user_id: 'u1',
    action: 'assigned',
    old_status: 'pending',
    new_status: 'in_progress',
    created_at: new Date().toISOString(),
    user: mockProfiles[0]
  }
];
