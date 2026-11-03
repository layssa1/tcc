# ReservaLab Backend API — Gestão e Agendamento Escolar

API RESTful desenvolvida com **Node.js** e **Express**, desenhada especificamente para o projeto de TCC do **ReservaLab (E.E. Monsenhor Bicudo)**, com controle de acesso baseado em perfis (**RBAC - Role-Based Access Control**).

---

## 🛡️ Matriz de Perfis (RBAC)

O sistema suporta nativamente dois papéis de usuário com privilégios distintos:

| Recurso / Rota | Administrador (Coordenação) | Professor (Docente) |
|---|---|---|
| **Painel Geral / Gestão** (`/gestao`) | ✅ Total acesso a relatórios e métricas | ❌ Redirecionado ao Portal do Professor |
| **Agenda Semanal Completa** (`/agenda`) | ✅ Visualiza toda a grade da escola | ✅ Visualiza toda a grade |
| **Grade Horária do Docente** (`/professor-calendario`) | ✅ Supervisiona horários de qualquer professor | ✅ Visualiza e interage com seus horários |
| **Cadastros (Professores, Espaços, Equipamentos)** | ✅ Criar, Atualizar, Excluir | 👁️ Apenas Leitura / Consulta de Recursos |
| **Solicitar Reserva** (`/reserva-register`) | ✅ Pode agendar para qualquer professor | ✅ Reserva vinculada estritamente ao seu perfil |
| **Listagem de Reservas** (`/reserva`) | ✅ Vê todas as reservas e pode excluir | ✅ Filtro rápido "Minhas Reservas" vs "Geral" |

---

## 🚀 Como Executar o Backend

### Pré-requisitos
- Node.js instalado (v18+)

### Instalação das dependências
```bash
cd backend
npm install
```

### Iniciar o servidor
```bash
npm start
```
> O servidor iniciará na porta `3000` em: `http://localhost:3000`

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

---

## 📡 Endpoints Principais

### Autenticação
- `POST /api/auth/login`: Realiza login por e-mail e senha.
  - Administrador: `gestao@bicudo.escola.gov.br` / `admin123`
  - Professor: `carlos.eduardo@escola.gov.br` / `prof123`
- `GET /api/auth/me`: Retorna os dados do perfil autenticado.

### Recursos Escolares
- `GET /api/professores`: Lista docentes ativos.
- `POST /api/professores`: *(Admin)* Cadastra novo professor.
- `GET /api/espacos`: Lista laboratórios, salas maker e auditório.
- `POST /api/espacos`: *(Admin)* Cadastra novo ambiente.
- `GET /api/equipamentos`: Lista recursos como projetores, notebooks e kits de robótica.

### Reservas & Calendário
- `GET /api/reservas`: Lista reservas com suporte a filtros (`?apenasMinhas=true`, `?professorId=...`, `?diaSemana=...`).
- `POST /api/reservas`: Cria reserva com **validação de conflito de horários** (impede sobreposição no mesmo espaço e horário).
- `PUT /api/reservas/:id/status`: Altera status da reserva (`Confirmada`, `Cancelada`).
- `DELETE /api/reservas/:id`: *(Admin)* Exclui reserva.

