# ReservaLab Backend API — Gestão e Agendamento Escolar

API RESTful completa desenvolvida com **Node.js**, **Express** e **MySQL** para o projeto de TCC do **ReservaLab (E.E. Monsenhor Bicudo)**, com persistência em banco relacional e controle de acesso baseado em perfis (**RBAC - Role-Based Access Control**).

---

## 🏗️ Estrutura do Projeto

```
backend/
├── .env.example              # Modelo de variáveis de ambiente
├── .env                      # Arquivo de configuração local
├── database.sql              # Script DDL e DML para criação do banco MySQL
├── package.json              # Dependências e scripts do projeto
├── README.md                 # Documentação da API
└── src/
    ├── app.js                # Configuração do Express, CORS e rotas
    ├── server.js             # Ponto de entrada e inicialização do servidor
    ├── config/
    │   └── db.js             # Pool de conexão MySQL (mysql2/promise)
    ├── controllers/
    │   ├── auth.controller.js        # Login e dados da sessão
    │   ├── dashboard.controller.js   # Métricas consolidadas
    │   ├── equipamento.controller.js # CRUD de equipamentos
    │   ├── espaco.controller.js      # CRUD de espaços e laboratórios
    │   ├── professor.controller.js   # CRUD de docentes
    │   └── reserva.controller.js     # CRUD de reservas com validação de conflitos
    ├── middlewares/
    │   ├── auth.middleware.js        # Validação JWT e controle de papéis (RBAC)
    │   └── error.middleware.js       # Tratamento de erros 404 e 500
    └── routes/
        ├── auth.routes.js
        ├── dashboard.routes.js
        ├── equipamento.routes.js
        ├── espaco.routes.js
        ├── professor.routes.js
        └── reserva.routes.js
```

---

## 🗄️ Passo a Passo para Configurar o MySQL

### 1. Criar e Povoar o Banco de Dados
Execute o script [database.sql](file:///c:/Users/NycoleRodriguesGomes/Desktop/tcc/backend/database.sql) no seu cliente MySQL preferido (MySQL Workbench, phpMyAdmin, DBeaver ou Terminal):

```bash
mysql -u root -p < database.sql
```

O script criará automaticamente o banco `reservalab`, todas as tabelas com integridade referencial (`ON DELETE CASCADE / SET NULL`) e inserirá os dados de demonstração.

### 2. Configurar o `.env`
No arquivo [backend/.env](file:///c:/Users/NycoleRodriguesGomes/Desktop/tcc/backend/.env), verifique as credenciais de acesso ao seu MySQL:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=reservalab
JWT_SECRET=reservalab_secret_key_tcc_bicudo_2026
JWT_EXPIRES_IN=8h
```

---

## 🚀 Como Executar o Backend

### 1. Instalar as dependências
```bash
cd backend
npm install
```

### 2. Iniciar o servidor
- Em produção:
  ```bash
  npm start
  ```
- Em modo de desenvolvimento (com auto-reload):
  ```bash
  npm run dev
  ```

O servidor estará disponível em: `http://localhost:3000`

---

## 🛡️ Credenciais Padrão (Seed)

| Papel | E-mail Institucional | Senha Padrão |
|---|---|---|
| **Administrador (Gestão)** | `gestao@bicudo.escola.gov.br` | `admin123` |
| **Professor (Docente)** | `carlos.eduardo@escola.gov.br` | `prof123` |
| **Professora (Docente)** | `mariana.silveira@escola.gov.br` | `prof123` |

---

## 📡 Visão Geral dos Endpoints

### 🔑 Autenticação
- `POST /api/auth/login`: Autentica com e-mail e senha, retornando token JWT e dados do usuário.
- `GET /api/auth/me`: Retorna os dados do perfil logado.

### 👨‍🏫 Professores
- `GET /api/professores`: Lista todos os professores ativos/inativos.
- `GET /api/professores/:id`: Retorna detalhes de um professor.
- `POST /api/professores`: *(Admin)* Cadastra um novo professor.
- `PUT /api/professores/:id`: *(Admin)* Atualiza dados do professor.
- `DELETE /api/professores/:id`: *(Admin)* Exclui professor.

### 🏫 Espaços e Laboratórios
- `GET /api/espacos`: Lista todos os espaços da escola.
- `GET /api/espacos/:id`: Retorna detalhes de um espaço.
- `POST /api/espacos`: *(Admin)* Cadastra novo ambiente.
- `PUT /api/espacos/:id`: *(Admin)* Atualiza dados do ambiente.
- `DELETE /api/espacos/:id`: *(Admin)* Remove ambiente.

### 📦 Equipamentos
- `GET /api/equipamentos`: Lista recursos disponíveis e em uso.
- `GET /api/equipamentos/:id`: Retorna detalhes do equipamento.
- `POST /api/equipamentos`: *(Admin)* Cadastra novo recurso/patrimônio.
- `PUT /api/equipamentos/:id`: *(Admin)* Atualiza dados do equipamento.
- `DELETE /api/equipamentos/:id`: *(Admin)* Remove equipamento.

### 📅 Reservas & Agendamentos
- `GET /api/reservas`: Lista reservas com suporte a query params (`?apenasMinhas=true`, `?professorId=1`, `?espacoId=2`, `?diaSemana=Segunda`).
- `GET /api/reservas/:id`: Detalhes de um agendamento.
- `POST /api/reservas`: Cria reserva com **validação de conflito de horário** (retorna `409 Conflict` se já houver reserva no mesmo espaço e horário).
- `PUT /api/reservas/:id/status`: Altera status (`Confirmada`, `Cancelada`, `Pendente`). Professores só alteram suas próprias reservas; Administradores alteram qualquer uma.
- `DELETE /api/reservas/:id`: *(Admin)* Exclui agendamento permanentemente.

### 📊 Painel Geral / Dashboard
- `GET /api/dashboard/metricas`: Retorna totais consolidados para os cards e gráficos da gestão.
