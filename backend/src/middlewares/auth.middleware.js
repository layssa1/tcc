import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'reservalab_secret_key_tcc_bicudo_2026';

/**
 * Middleware para identificar e autenticar o usuário via JWT ou headers legados de desenvolvimento.
 */
export async function autenticarUsuario(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const headerRole = req.headers['x-user-role'];
    const headerProfId = req.headers['x-professor-id'];

    // 1. Tentativa via Token JWT (Padrão de produção)
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded;
        return next();
      } catch (errToken) {
        return res.status(401).json({ erro: 'Token inválido ou expirado.' });
      }
    }

    // 2. Fallback de Desenvolvimento: cabeçalhos de papel (X-User-Role)
    if (headerRole === 'professor') {
      const profId = Number(headerProfId) || 1;
      const [profs] = await pool.query('SELECT * FROM professores WHERE id = ?', [profId]);
      const prof = profs.length > 0 ? profs[0] : null;

      req.usuario = {
        id: prof ? prof.id : 1,
        perfil: 'professor',
        professorId: prof ? prof.id : 1,
        nome: prof ? prof.nome : 'Prof. Carlos Eduardo',
        email: prof ? prof.email : 'carlos.eduardo@escola.gov.br',
        disciplina: prof ? prof.disciplina : 'Matemática & Robótica'
      };
      return next();
    }

    // 3. Fallback Padrão: Administrador / Gestão Escolar
    req.usuario = {
      id: 1,
      perfil: 'admin',
      nome: 'Coordenação Escolar',
      email: 'gestao@bicudo.escola.gov.br',
      cargo: 'Gestão Escolar'
    };
    return next();
  } catch (erro) {
    console.error('Erro na autenticação:', erro);
    return res.status(500).json({ erro: 'Erro interno ao processar autenticação.' });
  }
}

/**
 * Middleware para controle de acesso baseado em papéis (RBAC)
 * @param {Array<string>} perfisPermitidos Ex: ['admin'] ou ['admin', 'professor']
 */
export function exigirPerfil(perfisPermitidos = ['admin']) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ erro: 'Usuário não autenticado.' });
    }

    if (!perfisPermitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({
        erro: 'Acesso negado.',
        mensagem: `Ação permitida apenas para os perfis: ${perfisPermitidos.join(', ')}.`
      });
    }

    next();
  };
}
