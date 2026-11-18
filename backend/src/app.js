import express from 'express';
import cors from 'cors';

// Importação das Rotas
import authRoutes from './routes/auth.routes.js';
import professorRoutes from './routes/professor.routes.js';
import espacoRoutes from './routes/espaco.routes.js';
import equipamentoRoutes from './routes/equipamento.routes.js';
import reservaRoutes from './routes/reserva.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

// Middlewares globais
import { naoEncontrado, manipuladorErros } from './middlewares/error.middleware.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    sistema: 'ReservaLab Backend API — E.E. Monsenhor Bicudo',
    versao: '2.0.0',
    data: new Date().toISOString()
  });
});

// Registro dos Módulos de Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/professores', professorRoutes);
app.use('/api/espacos', espacoRoutes);
app.use('/api/equipamentos', equipamentoRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Tratamento de Rotas não Encontradas (404)
app.use(naoEncontrado);

// Tratamento Global de Erros (500)
app.use(manipuladorErros);

export default app;
