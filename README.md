# ⚙️ Sistema Integrado de Controle de Demandas (SICD)

O **SICD** é um sistema para **gerenciamento de demandas de cidadãos**, permitindo o **cadastro, acompanhamento e organização de solicitações públicas** entre diferentes setores de uma instituição.

---

## 🧰 Requisitos necessários

Antes de executar o projeto, verifique se os seguintes programas estão instalados no seu computador:

- [**Git**](https://git-scm.com/downloads)  
  Necessário para clonar o repositório.

- [**Docker Desktop**](https://www.docker.com/get-started/)  
  Necessário para rodar os containers do **frontend (Angular)** e **backend (Spring Boot)**.

> ⚠️ Certifique-se de que o Docker Desktop está **aberto e em execução** e que as portas 8080 e 4200 não estão sendo usadas antes de continuar.

---

## 👥 Usuários padrão

Durante a inicialização do backend, **três usuários são criados automaticamente** para facilitar a vizualização das funções do SICD:

| Perfil | CPF | Email | Senha |
|---------|-----|--------|--------|
| 🛡️ **Administrador** | `00000000001` | admin@teste.com | 123456 |
| 🧾 **Atendente** | `00000000002` | atendente@teste.com | 123456 |
| 👤 **Cidadão** | `00000000003` | cidadao@teste.com | 123456 |

---

## 🔑 Permissões e Cadastro de Usuários

- ✅ **Cidadão:** pode se cadastrar diretamente na tela de login clicando em **Cadastre-se**.  
- 🔒 **Administrador:** é o único perfil que pode criar novos usuários **Administradores**, **Atendentes** ou **Cidadão** dentro do sistema.  
- ✏️ Todos os usuários podem **alterar suas informações pessoais e adicionar foto de perfil** após o login.

---

## 🚀 Como executar o projeto

### 🔹 Passo 1 — Abrir o terminal (Prompt de Comando)
No Windows, pressione:
```
Win + R → digite cmd → Enter
```

---

### 🔹 Passo 2 — Clonar o repositório
No terminal, execute o comando abaixo:

```bash
git clone https://github.com/GabrielSoaresV/SICD.git
```

---

### 🔹 Passo 3 — Acessar a pasta do projeto
```bash
cd SICD
```

---

### 🔹 Passo 4 — Executar o sistema com Docker
Agora, execute o script abaixo:

```bash
.\start_docker.bat
```

> 🧩 Esse comando irá **construir as imagens Docker** e **iniciar automaticamente o backend e o frontend**.  
> Durante o processo, pode levar alguns minutos dependendo da velocidade da sua internet e do hardware.

---

### 🔹 Passo 5 — Aguardar o carregamento
Após alguns instantes, o **site será aberto automaticamente no seu navegador padrão** 🚀

| Serviço | Porta | Endereço |
|----------|--------|-----------|
| **Frontend (Angular)** | 4200 | [http://localhost:4200](http://localhost:4200) |
| **Backend (Spring Boot)** | 8080 | [http://localhost:8080](http://localhost:8080) |

---

## ⚡ Funcionalidades principais

- Cadastro e edição de cidadãos  
- Registro e acompanhamento de demandas  
- Atualização de status (“Aberta”, “Em andamento”, “Concluída”)  
- Pesquisa e filtragem de registros  
- Upload de foto de perfil  
- Comunicação entre setores via chat 
- Serviço de autentificação via token
- Rotas dinamicas com nível de acesso
- Integração total entre frontend (Angular) e backend (Spring Boot)  

---

## 🧱 Estrutura dos containers Docker

| Container | Função | Tecnologia |
|------------|---------|-------------|
| **sicd-backend** | API REST (Java + Spring Boot) | Porta 8080 |
| **sicd-frontend** | Interface do sistema (Angular) | Porta 4200 |

---

## 🧩 Comandos úteis do Docker

Parar os containers:
```bash
docker-compose down
```

Reiniciar:
```bash
docker-compose up -d
```

Ver logs em tempo real:
```bash
docker-compose logs -f
```

Limpar containers e imagens antigas:
```bash
docker system prune -a
```

---

## 🧠 Observações

- O sistema utiliza **banco H2 em memória**.  
- Planeja-se migração futura para bancos persistentes **(PostgreSQL/MySQL)**.  
- Layout ainda em aprimoramento e refinamento visual.  
- Funções de autenticação e relatórios avançados em desenvolvimento.
- O backend será remodelado seguindo a arquitetura **Hexagonal (Ports and Adapters)** para maior desacoplamento e escalabilidade.
- Será adicionada a opção de alternar entre tema claro e escuro no frontend.
- Melhorias planejadas para as telas de login e registro público, com foco em experiência do usuário (UX).
- Implementação futura de pipelines automatizadas para criação de demandas, usuários e conversas de teste — simulando situações reais para demonstrações. 
- Separação dos métodos de autenticação e perfil dentro do **ProfileService** no backend, garantindo melhor organização e responsabilidade de código.
- Inclusão de **DTOs** específicos para aprimorar as respostas do backend e otimizar a comunicação com o frontend.
- Esta sendo feita a melhoria das validações de dados no Backend e Frontend.
- Não foi adicionado retornos via console para simular um projeto em produção.


---

## 👤 Autor

**Gabriel Soares**  
📧 [soaresgabrielvinicius@gmail.com](mailto:soaresgabrielvinicius@gmail.com)  
💻 Projeto com foco em **aprendizado prático e aplicação real de arquitetura com Angular + Spring Boot + Docker**.
