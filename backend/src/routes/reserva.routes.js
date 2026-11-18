import { Router } from 'express';
import {
  listarReservas,
  obterReservaPorId,
  criarReserva,
  atualizarStatusReserva,
  excluirReserva
} from '../controllers/reserva.controller.js';
import { autenticarUsuario, exigirPerfil } from '../middlewares/auth.middleware.js';

const router = Router();

// Middleware de autenticação em todas as rotas de reserva
router.use(autenticarUsuario);

router.get('/', listarReservas);
router.get('/:id', obterReservaPorId);
router.post('/', criarReserva);
router.put('/:id/status', atualizarStatusReserva);

// Apenas Administrador pode excluir reservas permanentemente
router.delete('/:id', exigirPerfil(['admin']), excluirReserva);

export default router;
