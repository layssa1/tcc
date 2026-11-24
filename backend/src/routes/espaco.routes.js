import { Router } from 'express';
import {
  listarEspacos,
  obterEspacoPorId,
  criarEspaco,
  atualizarEspaco,
  excluirEspaco
} from '../controllers/espaco.controller.js';
import { autenticarUsuario, exigirPerfil } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', listarEspacos);
router.get('/:id', obterEspacoPorId);

router.post('/', autenticarUsuario, exigirPerfil(['admin']), criarEspaco);
router.put('/:id', autenticarUsuario, exigirPerfil(['admin']), atualizarEspaco);
router.delete('/:id', autenticarUsuario, exigirPerfil(['admin']), excluirEspaco);

export default router;
