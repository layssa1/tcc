import pool from '../config/db.js';

export async function listarProfessores(req, res, next) {
  try {
    const [professores] = await pool.query(
      'SELECT id, nome, rg, email, disciplina, status, telefone, criado_em as criadoEm FROM professores ORDER BY nome ASC'
    );
    res.json(professores);
  } catch (erro) {
    next(erro);
  }
}

export async function obterProfessorPorId(req, res, next) {
  try {
    const { id } = req.params;
    const [linhas] = await pool.query(
      'SELECT id, nome, rg, email, disciplina, status, telefone, criado_em as criadoEm FROM professores WHERE id = ?',
      [id]
    );

    if (linhas.length === 0) {
      return res.status(404).json({ erro: 'Professor não encontrado.' });
    }

    res.json(linhas[0]);
  } catch (erro) {
    next(erro);
  }
}

export async function criarProfessor(req, res, next) {
  try {
    const { nome, rg, email, disciplina, status, telefone } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ erro: 'Nome e e-mail são obrigatórios.' });
    }

    // Verificar se e-mail já existe
    const [existentes] = await pool.query('SELECT id FROM professores WHERE LOWER(email) = LOWER(?)', [email.trim()]);
    if (existentes.length > 0) {
      return res.status(409).json({ erro: 'Já existe um professor cadastrado com este e-mail.' });
    }

    const [resultado] = await pool.query(
      'INSERT INTO professores (nome, rg, email, disciplina, status, telefone) VALUES (?, ?, ?, ?, ?, ?)',
      [
        nome.trim(),
        rg || '',
        email.trim().toLowerCase(),
        disciplina || 'Geral',
        status || 'Ativo',
        telefone || ''
      ]
    );

    const novoId = resultado.insertId;
    const [novo] = await pool.query('SELECT * FROM professores WHERE id = ?', [novoId]);

    res.status(201).json(novo[0]);
  } catch (erro) {
    next(erro);
  }
}

export async function atualizarProfessor(req, res, next) {
  try {
    const { id } = req.params;
    const { nome, rg, email, disciplina, status, telefone } = req.body;

    const [existentes] = await pool.query('SELECT id FROM professores WHERE id = ?', [id]);
    if (existentes.length === 0) {
      return res.status(404).json({ erro: 'Professor não encontrado.' });
    }

    await pool.query(
      `UPDATE professores 
       SET nome = COALESCE(?, nome),
           rg = COALESCE(?, rg),
           email = COALESCE(?, email),
           disciplina = COALESCE(?, disciplina),
           status = COALESCE(?, status),
           telefone = COALESCE(?, telefone)
       WHERE id = ?`,
      [nome, rg, email, disciplina, status, telefone, id]
    );

    const [atualizado] = await pool.query('SELECT * FROM professores WHERE id = ?', [id]);
    res.json(atualizado[0]);
  } catch (erro) {
    next(erro);
  }
}

export async function excluirProfessor(req, res, next) {
  try {
    const { id } = req.params;

    const [existentes] = await pool.query('SELECT id FROM professores WHERE id = ?', [id]);
    if (existentes.length === 0) {
      return res.status(404).json({ erro: 'Professor não encontrado.' });
    }

    await pool.query('DELETE FROM professores WHERE id = ?', [id]);
    res.json({ mensagem: 'Professor excluído com sucesso.' });
  } catch (erro) {
    next(erro);
  }
}
