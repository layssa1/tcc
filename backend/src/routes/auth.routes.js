import { Router } from 'express';
import { login, me } from '../controllers/auth.controller.js';
import { autenticarUsuario } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', login);
router.get('/me', autenticarUsuario, me);

export default router;
