import { Router } from 'express';
import { obterMetricas } from '../controllers/dashboard.controller.js';
import { autenticarUsuario } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/metricas', autenticarUsuario, obterMetricas);

export default router;
