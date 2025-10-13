# Controle de Demandas de Cidadãos

Sistema para gerenciar e organizar demandas de cidadãos, permitindo acompanhamento eficiente de solicitações, cadastros e comunicação entre setores.

## Tecnologias utilizadas

- **Frontend: Angular
- **Backend: Java + Spring Boot
- **Banco de dados: H2
- **Controle de versão: Git / GitHub
- **Outras ferramentas: Node.js, npm, VS Code, Postman

## Estrutura do projeto

```
Controle de Demandas de Cidadãos/
│
├─ app-controle-demandas/      ← Projeto Angular
│   ├─ src/
│   │   ├─ components/
│   │   │   ├─ componentes-cidadao/
│   │   │   │   ├─ cidadao-edit/
│   │   │   │   ├─ cidadao-form/
│   │   │   │   └─ cidadao-list/
│   │   │   ├─ componentes-demanda/
│   │   │   │   ├─ demanda-edit/
│   │   │   │   ├─ demanda-form/
│   │   │   │   └─ demanda-list/
│   │   │   ├─ modals/
│   │   │   │   ├─ cidadao-editar/
│   │   │   │   ├─ demanda-editar/
│   │   │   │   └─ listar-demandas-cidadao/
│   │   │   └─ navbar/
│   │   ├─ dtos/
│   │   │   ├─ dto-cidadaos/
│   │   │   └─ dto-demandas/
│   │   ├─ models/
│   │   ├─ pages/
│   │   │   ├─ page-home/
│   │   │   └─ page-register/
│   │   ├─ pipes/
│   │   └─ services/
│   ├─ angular.json
│   └─ package.json
│
├─ controle-demandas-api/                    ← Projeto Spring Boot
│   ├─ src/
│   │   ├─ main/
│   │   │   ├─ java/
│   │   │   │   └─ com/controle/demandas/api/
│   │   │   │       ├─ config/
│   │   │   │       ├─ controller/
│   │   │   │       ├─ dtoCidadaos/
│   │   │   │       ├─ dtoDemandas/
│   │   │   │       ├─ exception/
│   │   │   │       ├─ model/
│   │   │   │       ├─ repository/
│   │   │   │       ├─ response/
│   │   │   │       ├─ service/
│   │   │   │       └─ validation/
│   │   │   │           └─ annotation/
│   │   │   └─ resources/
│   │   │       ├─ static/
│   │   │       └─ templates/
│   │   └─ test/
│   │       └─ java/
│   │           └─ com/controle/demandas/api/
│   └─ target/
│       ├─ classes/
│       │   └─ com/controle/demandas/api/
│       │       ├─ config/
│       │       ├─ controller/
│       │       ├─ dtoCidadaos/
│       │       ├─ dtoDemandas/
│       │       ├─ exception/
│       │       ├─ model/
│       │       ├─ repository/
│       │       ├─ response/
│       │       ├─ service/
│       │       └─ validation/
│       │           └─ annotation/
│       ├─ generated-sources/
│       │   └─ annotations/
│       ├─ generated-test-sources/
│       │   └─ test-annotations/
│       └─ test-classes/
│           └─ com/controle/demandas/api/
│
└─ README.md
---

## Como rodar o projeto

### Frontend (Angular)
'''
1. Abra o terminal na pasta `app-controle-demandas`
'''
2. Instale as dependências:
```bash
npm install
```
3. Inicie o servidor de desenvolvimento:
```bash
ng serve
```
4. Acesse em no navegador `http://localhost:4200`

### Backend (Spring Boot)
1. Abra o terminal na pasta `controle-denabdas-api`
2. Compile e rode o projeto:
```bash
mvn spring-boot:run
```
3. O servidor vai rodar em `http://localhost:8080`

---

## Funcionalidades principais

- Cadastro de cidadãos
- Criação e acompanhamento de demandas
- Pesquisa e filtragem de registros
- Atualização de status de demandas
- Relatórios básicos

---

## Observações

Observações:
Algumas funcionalidades e melhorias planejadas não puderam ser implementadas nesta versão do projeto.

- A lógica de alteração de status das demandas (“Aberta” → “Em andamento” → “Concluída”) não está disponível no front-end atual, mas está funcionando no projeto paralelo AppFrontEnd.

- A validação de CPF e e-mail do backend não está integrada ao front-end deste projeto.

- O layout ainda não está totalmente refinado: algumas tabelas, cores institucionais e ícones não foram aplicados.

- Não deu tempo de criar a tela de login e a logica de Autenticação simulada. 

- Documentação da API (Swagger ou Postman). 

- Deploy local simples (Dockerfile ou Docker Compose).

- Implementar os filtros no front-end (ex.: listar apenas demandas abertas).

- Todas notificações de error para o cliente .
---

## Autor

Gabriel Soares  
Email: soaresgabrielvinicius@gmail.com
