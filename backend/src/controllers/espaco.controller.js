import pool from '../config/db.js';

function formatarEspaco(row) {
  let equipamentos = [];
  if (row.equipamentos) {
    if (typeof row.equipamentos === 'string') {
      try {
        equipamentos = JSON.parse(row.equipamentos);
      } catch (e) {
        equipamentos = row.equipamentos.split(',').map(s => s.trim()).filter(Boolean);
      }
    } else if (Array.isArray(row.equipamentos)) {
      equipamentos = row.equipamentos;
    }
  }

  return {
    id: row.id,
    nome: row.nome,
    tipo: row.tipo,
    capacidade: Number(row.capacidade) || 0,
    equipamentos,
    status: row.status,
    icone: row.icone || '🏫',
    localizacao: row.localizacao || '',
    criadoEm: row.criado_em
  };
}

export async function listarEspacos(req, res, next) {
  try {
    const [linhas] = await pool.query('SELECT * FROM espacos ORDER BY nome ASC');
    res.json(linhas.map(formatarEspaco));
  } catch (erro) {
    next(erro);
  }
}

export async function obterEspacoPorId(req, res, next) {
  try {
    const { id } = req.params;
    const [linhas] = await pool.query('SELECT * FROM espacos WHERE id = ?', [id]);

    if (linhas.length === 0) {
      return res.status(404).json({ erro: 'Espaço não encontrado.' });
    }

    res.json(formatarEspaco(linhas[0]));
  } catch (erro) {
    next(erro);
  }
}

export async function criarEspaco(req, res, next) {
  try {
    const { nome, tipo, capacidade, equipamentos, status, icone, localizacao } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: 'O nome do espaço é obrigatório.' });
    }

    const eqsStr = Array.isArray(equipamentos)
      ? JSON.stringify(equipamentos)
      : (equipamentos || '');

    const [resultado] = await pool.query(
      `INSERT INTO espacos (nome, tipo, capacidade, equipamentos, status, icone, localizacao)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nome.trim(),
        tipo || 'Sala',
        Number(capacidade) || 30,
        eqsStr,
        status || 'Disponível',
        icone || '🏫',
        localizacao || 'Prédio Principal'
      ]
    );

    const [novo] = await pool.query('SELECT * FROM espacos WHERE id = ?', [resultado.insertId]);
    res.status(201).json(formatarEspaco(novo[0]));
  } catch (erro) {
    next(erro);
  }
}

export async function atualizarEspaco(req, res, next) {
  try {
    const { id } = req.params;
    const { nome, tipo, capacidade, equipamentos, status, icone, localizacao } = req.body;

    const [existentes] = await pool.query('SELECT id FROM espacos WHERE id = ?', [id]);
    if (existentes.length === 0) {
      return res.status(404).json({ erro: 'Espaço não encontrado.' });
    }

    const eqsStr = equipamentos !== undefined
      ? (Array.isArray(equipamentos) ? JSON.stringify(equipamentos) : equipamentos)
      : undefined;

    await pool.query(
      `UPDATE espacos
       SET nome = COALESCE(?, nome),
           tipo = COALESCE(?, tipo),
           capacidade = COALESCE(?, capacidade),
           equipamentos = COALESCE(?, equipamentos),
           status = COALESCE(?, status),
           icone = COALESCE(?, icone),
           localizacao = COALESCE(?, localizacao)
       WHERE id = ?`,
      [nome, tipo, capacidade, eqsStr, status, icone, localizacao, id]
    );

    const [atualizado] = await pool.query('SELECT * FROM espacos WHERE id = ?', [id]);
    res.json(formatarEspaco(atualizado[0]));
  } catch (erro) {
    next(erro);
  }
}

export async function excluirEspaco(req, res, next) {
  try {
    const { id } = req.params;

    const [existentes] = await pool.query('SELECT id FROM espacos WHERE id = ?', [id]);
    if (existentes.length === 0) {
      return res.status(404).json({ erro: 'Espaço não encontrado.' });
    }

    await pool.query('DELETE FROM espacos WHERE id = ?', [id]);
    res.json({ mensagem: 'Espaço excluído com sucesso.' });
  } catch (erro) {
    next(erro);
  }
}
