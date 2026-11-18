import { Router } from 'express';
import {
  listarProfessores,
  obterProfessorPorId,
  criarProfessor,
  atualizarProfessor,
  excluirProfessor
} from '../controllers/professor.controller.js';
import { autenticarUsuario, exigirPerfil } from '../middlewares/auth.middleware.js';

const router = Router();

// Leitura pública/autenticada
router.get('/', listarProfessores);
router.get('/:id', obterProfessorPorId);

// Escrita restrita a administradores
router.post('/', autenticarUsuario, exigirPerfil(['admin']), criarProfessor);
router.put('/:id', autenticarUsuario, exigirPerfil(['admin']), atualizarProfessor);
router.delete('/:id', autenticarUsuario, exigirPerfil(['admin']), excluirProfessor);

export default router;
