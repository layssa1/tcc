import dotenv from 'dotenv';
import app from './app.js';
import { testarConexao } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  console.log('------------------------------------------------------------');
  console.log('🚀 Inicializando ReservaLab Backend API...');
  console.log('------------------------------------------------------------');

  // Testar a conexão com o MySQL
  const dbStatus = await testarConexao();

  app.listen(PORT, () => {
    console.log(`============================================================`);
    console.log(` 🏫 ReservaLab Backend API — E.E. Monsenhor Bicudo`);
    console.log(` 🌐 Servidor rodando em: http://localhost:${PORT}`);
    console.log(` 📊 Banco de Dados MySQL: ${dbStatus.ok ? 'CONECTADO ✅' : 'PENDENTE DE CONEXÃO ⚠️'}`);
    console.log(` 🛡️  Controle de Acesso RBAC: Ativo (Admin & Professor)`);
    console.log(`============================================================`);
    console.log(` Endpoints disponíveis:`);
    console.log(` - GET    /api/health`);
    console.log(` - POST   /api/auth/login`);
    console.log(` - GET    /api/auth/me`);
    console.log(` - CRUD   /api/professores`);
    console.log(` - CRUD   /api/espacos`);
    console.log(` - CRUD   /api/equipamentos`);
    console.log(` - CRUD   /api/reservas (com validação de conflito)`);
    console.log(` - GET    /api/dashboard/metricas`);
    console.log(`============================================================`);
  });
}

iniciarServidor();
