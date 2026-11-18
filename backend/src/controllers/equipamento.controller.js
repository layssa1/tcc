import pool from '../config/db.js';

function formatarEquipamento(row) {
  return {
    id: row.id,
    nome: row.nome,
    categoria: row.categoria,
    quantidadeTotal: Number(row.quantidade_total) || 0,
    quantidadeDisponivel: Number(row.quantidade_disponivel) || 0,
    status: row.status,
    icone: row.icone || '📦',
    patrimonio: row.patrimonio || '',
    criadoEm: row.criado_em
  };
}

export async function listarEquipamentos(req, res, next) {
  try {
    const [linhas] = await pool.query('SELECT * FROM equipamentos ORDER BY nome ASC');
    res.json(linhas.map(formatarEquipamento));
  } catch (erro) {
    next(erro);
  }
}

export async function obterEquipamentoPorId(req, res, next) {
  try {
    const { id } = req.params;
    const [linhas] = await pool.query('SELECT * FROM equipamentos WHERE id = ?', [id]);

    if (linhas.length === 0) {
      return res.status(404).json({ erro: 'Equipamento não encontrado.' });
    }

    res.json(formatarEquipamento(linhas[0]));
  } catch (erro) {
    next(erro);
  }
}

export async function criarEquipamento(req, res, next) {
  try {
    const {
      nome,
      categoria,
      quantidadeTotal,
      quantidadeDisponivel,
      status,
      icone,
      patrimonio
    } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: 'O nome do equipamento é obrigatório.' });
    }

    const total = Number(quantidadeTotal) || 1;
    const disponivel = quantidadeDisponivel !== undefined ? Number(quantidadeDisponivel) : total;

    const [resultado] = await pool.query(
      `INSERT INTO equipamentos (nome, categoria, quantidade_total, quantidade_disponivel, status, icone, patrimonio)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nome.trim(),
        categoria || 'Geral',
        total,
        disponivel,
        status || 'Disponível',
        icone || '📦',
        patrimonio || null
      ]
    );

    const [novo] = await pool.query('SELECT * FROM equipamentos WHERE id = ?', [resultado.insertId]);
    res.status(201).json(formatarEquipamento(novo[0]));
  } catch (erro) {
    next(erro);
  }
}

export async function atualizarEquipamento(req, res, next) {
  try {
    const { id } = req.params;
    const {
      nome,
      categoria,
      quantidadeTotal,
      quantidadeDisponivel,
      status,
      icone,
      patrimonio
    } = req.body;

    const [existentes] = await pool.query('SELECT id FROM equipamentos WHERE id = ?', [id]);
    if (existentes.length === 0) {
      return res.status(404).json({ erro: 'Equipamento não encontrado.' });
    }

    await pool.query(
      `UPDATE equipamentos
       SET nome = COALESCE(?, nome),
           categoria = COALESCE(?, categoria),
           quantidade_total = COALESCE(?, quantidade_total),
           quantidade_disponivel = COALESCE(?, quantidade_disponivel),
           status = COALESCE(?, status),
           icone = COALESCE(?, icone),
           patrimonio = COALESCE(?, patrimonio)
       WHERE id = ?`,
      [
        nome,
        categoria,
        quantidadeTotal !== undefined ? Number(quantidadeTotal) : undefined,
        quantidadeDisponivel !== undefined ? Number(quantidadeDisponivel) : undefined,
        status,
        icone,
        patrimonio,
        id
      ]
    );

    const [atualizado] = await pool.query('SELECT * FROM equipamentos WHERE id = ?', [id]);
    res.json(formatarEquipamento(atualizado[0]));
  } catch (erro) {
    next(erro);
  }
}

export async function excluirEquipamento(req, res, next) {
  try {
    const { id } = req.params;

    const [existentes] = await pool.query('SELECT id FROM equipamentos WHERE id = ?', [id]);
    if (existentes.length === 0) {
      return res.status(404).json({ erro: 'Equipamento não encontrado.' });
    }

    await pool.query('DELETE FROM equipamentos WHERE id = ?', [id]);
    res.json({ mensagem: 'Equipamento excluído com sucesso.' });
  } catch (erro) {
    next(erro);
  }
}
