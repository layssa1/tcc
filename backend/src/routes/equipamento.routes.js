import { Router } from 'express';
import {
  listarEquipamentos,
  obterEquipamentoPorId,
  criarEquipamento,
  atualizarEquipamento,
  excluirEquipamento
} from '../controllers/equipamento.controller.js';
import { autenticarUsuario, exigirPerfil } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', listarEquipamentos);
router.get('/:id', obterEquipamentoPorId);

router.post('/', autenticarUsuario, exigirPerfil(['admin']), criarEquipamento);
router.put('/:id', autenticarUsuario, exigirPerfil(['admin']), atualizarEquipamento);
router.delete('/:id', autenticarUsuario, exigirPerfil(['admin']), excluirEquipamento);

export default router;
