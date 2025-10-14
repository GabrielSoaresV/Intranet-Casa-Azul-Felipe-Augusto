/*
  # Sistema de Controle de Demandas de Cidadãos

  ## 1. Novas Tabelas

  ### `citizens` (Cidadãos)
  - `id` (uuid, primary key)
  - `name` (text) - Nome do cidadão
  - `email` (text, unique) - Email do cidadão
  - `phone` (text) - Telefone
  - `cpf` (text, unique) - CPF do cidadão
  - `address` (text) - Endereço
  - `created_at` (timestamptz) - Data de criação
  - `created_by` (uuid) - ID do usuário que cadastrou

  ### `demands` (Demandas)
  - `id` (uuid, primary key)
  - `citizen_id` (uuid, foreign key) - Referência ao cidadão
  - `title` (text) - Título da demanda
  - `description` (text) - Descrição detalhada
  - `status` (text) - Status: 'pending', 'in_progress', 'completed', 'cancelled'
  - `priority` (text) - Prioridade: 'low', 'medium', 'high'
  - `category` (text) - Categoria da demanda
  - `assigned_to` (uuid, nullable) - Atendente responsável
  - `created_at` (timestamptz) - Data de criação
  - `updated_at` (timestamptz) - Última atualização
  - `created_by` (uuid) - Quem criou a demanda

  ### `messages` (Mensagens do Chat)
  - `id` (uuid, primary key)
  - `demand_id` (uuid, foreign key) - Referência à demanda
  - `user_id` (uuid) - ID do usuário que enviou
  - `message` (text) - Conteúdo da mensagem
  - `created_at` (timestamptz) - Data/hora do envio

  ### `demand_history` (Histórico de Demandas)
  - `id` (uuid, primary key)
  - `demand_id` (uuid, foreign key) - Referência à demanda
  - `user_id` (uuid) - Quem fez a ação
  - `action` (text) - Tipo de ação: 'created', 'updated', 'assigned', 'completed', 'cancelled'
  - `old_status` (text, nullable) - Status anterior
  - `new_status` (text, nullable) - Novo status
  - `notes` (text, nullable) - Observações
  - `created_at` (timestamptz) - Data/hora da ação

  ### `profiles` (Perfis de Usuários)
  - `id` (uuid, primary key, references auth.users)
  - `name` (text) - Nome do usuário
  - `email` (text) - Email
  - `role` (text) - Função: 'admin', 'attendant'
  - `avatar_url` (text, nullable) - URL da foto
  - `created_at` (timestamptz) - Data de criação
  - `updated_at` (timestamptz) - Última atualização

  ## 2. Segurança (RLS)
  
  - Todas as tabelas têm RLS habilitado
  - Usuários autenticados podem acessar dados conforme suas permissões
  - Políticas específicas para leitura, criação, atualização e exclusão
  
  ## 3. Índices
  
  - Índices em foreign keys para melhor performance
  - Índices em campos frequentemente consultados (status, citizen_id, etc.)
*/

-- Tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'attendant',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de cidadãos
CREATE TABLE IF NOT EXISTS citizens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  cpf text UNIQUE NOT NULL,
  address text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Tabela de demandas
CREATE TABLE IF NOT EXISTS demands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id uuid NOT NULL REFERENCES citizens(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  priority text NOT NULL DEFAULT 'medium',
  category text NOT NULL,
  assigned_to uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  demand_id uuid NOT NULL REFERENCES demands(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Tabela de histórico
CREATE TABLE IF NOT EXISTS demand_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  demand_id uuid NOT NULL REFERENCES demands(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  action text NOT NULL,
  old_status text,
  new_status text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_demands_citizen ON demands(citizen_id);
CREATE INDEX IF NOT EXISTS idx_demands_status ON demands(status);
CREATE INDEX IF NOT EXISTS idx_demands_assigned ON demands(assigned_to);
CREATE INDEX IF NOT EXISTS idx_messages_demand ON messages(demand_id);
CREATE INDEX IF NOT EXISTS idx_history_demand ON demand_history(demand_id);

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizens ENABLE ROW LEVEL SECURITY;
ALTER TABLE demands ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE demand_history ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Políticas para citizens
CREATE POLICY "Authenticated users can view citizens"
  ON citizens FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create citizens"
  ON citizens FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update citizens"
  ON citizens FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete citizens"
  ON citizens FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para demands
CREATE POLICY "Authenticated users can view demands"
  ON demands FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create demands"
  ON demands FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update demands"
  ON demands FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete demands"
  ON demands FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para messages
CREATE POLICY "Authenticated users can view messages"
  ON messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Políticas para demand_history
CREATE POLICY "Authenticated users can view history"
  ON demand_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create history"
  ON demand_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);