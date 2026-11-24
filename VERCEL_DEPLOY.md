# 🚀 Guia de Deploy no Vercel — ReservaLab

Este projeto foi configurado com arquitetura Fullstack Monorepo para ser publicado no **Vercel** com um único clique, hospedando o frontend Angular e as funções Serverless da API Express no mesmo domínio.

---

## 📋 Como Funciona a Estrutura no Vercel

```
/                         -> Raiz do Repositório
├── vercel.json           -> Configuração global de build, rewrites e rotas
├── api/
│   └── index.js          -> Ponto de entrada Serverless da API Express (/api/*)
├── frontend/
│   ├── vercel.json       -> Configuração caso escolha a pasta frontend como raiz
│   └── dist/.../browser  -> Saída estática do Angular com suporte a SPA
└── backend/              -> Lógica de negócio, rotas e banco de dados
```

- **Frontend:** Ao acessar `https://seu-projeto.vercel.app`, o Vercel serve o frontend Angular com todas as 12 rotas protegidas e pré-renderizadas.
- **Backend (API):** Qualquer chamada para `https://seu-projeto.vercel.app/api/*` é roteada diretamente para o Express Serverless (`api/index.js`). Não há problemas de CORS em produção!

---

## 🛠️ Passo a Passo para Fazer o Deploy no Vercel

### 1. Enviar o Código para o GitHub
Se você ainda não enviou as alterações para o seu repositório:
```bash
git add .
git commit -m "feat: preparar projeto para deploy no Vercel"
git push origin main
```

---

### 2. Importar o Projeto no Vercel
1. Acesse o painel da [Vercel](https://vercel.com) e faça login com sua conta do GitHub.
2. Clique em **"Add New..."** > **"Project"**.
3. Selecione o repositório do seu TCC (**tcc**).
4. Na tela de configuração do projeto:
   - **Framework Preset:** Deixe como `Other` ou detectado automaticamente.
   - **Root Directory:** Deixe `./` (a raiz do projeto).
   - O comando de build já está definido no [vercel.json](./vercel.json):
     - `cd frontend && npm install && npm run build`
     - Diretório de saída: `frontend/dist/repositorio/browser`

---

### 3. Configurar as Variáveis de Ambiente (Environment Variables)
No painel do projeto no Vercel, vá em **Settings** > **Environment Variables** e adicione as seguintes variáveis:

| Variável | Descrição | Exemplo |
|---|---|---|
| `JWT_SECRET` | Chave secreta de autenticação | `reservalab_secret_key_tcc_bicudo_2026` |
| `DB_HOST` | Host do banco MySQL em nuvem | `mysql-xxxx.aivencloud.com` |
| `DB_PORT` | Porta do banco | `3306` (ou da nuvem, ex: `12345`) |
| `DB_USER` | Usuário do banco | `avnadmin` ou `root` |
| `DB_PASSWORD` | Senha do banco em nuvem | `sua_senha_secreta` |
| `DB_NAME` | Nome do banco | `reservalab` ou `defaultdb` |
| `DB_SSL` | Habilitar SSL para nuvem | `true` |

> 💡 **Ou use a connection string única:**
> Se o seu provedor de banco fornecer uma URL completa:
> `DATABASE_URL` = `mysql://usuario:senha@host:porta/banco?ssl={"rejectUnauthorized":false}`

---

### 4. Onde Hospedar o Banco MySQL Gratuitamente para Nuvem?
Como o Vercel roda em nuvem (Serverless), o banco não pode ser `localhost`. Você pode criar um banco MySQL gratuito em poucos minutos em qualquer um destes serviços:

1. **[Aiven for MySQL](https://aiven.io/mysql)** *(Plano Gratuito com 5 GB de armazenamento, SSL incluso)*
2. **[TiDB Cloud](https://tidbcloud.com)** *(Plano Serverless gratuito, 100% compatível com MySQL)*
3. **[Clever Cloud](https://www.clever-cloud.com)** *(Add-on gratuito de MySQL)*
4. **[Railway](https://railway.app)** *(Plano trial para MySQL)*

Após criar o banco em nuvem, basta rodar o script [backend/database.sql](./backend/database.sql) uma única vez no cliente (DBeaver ou MySQL Workbench) apontando para o host da nuvem.

---

### 5. Finalizar o Deploy
Clique no botão **"Deploy"**. Em cerca de 1 a 2 minutos o Vercel concluirá a compilação e entregará o seu link oficial:
`https://seu-projeto.vercel.app`
