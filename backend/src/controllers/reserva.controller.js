import pool from '../config/db.js';

function formatarReserva(row) {
  return {
    id: row.id,
    professorId: row.professor_id,
    professorNome: row.professor_nome || row.professorNome,
    espacoId: row.espaco_id,
    espacoNome: row.espaco_nome || row.espacoNome,
    equipamentoNome: row.equipamento_nome || 'Nenhum',
    diaSemana: row.dia_semana,
    data: row.data_formatada || row.data,
    semana: row.semana,
    horarioInicio: row.horario_inicio ? row.horario_inicio.substring(0, 5) : '',
    horarioFim: row.horario_fim ? row.horario_fim.substring(0, 5) : '',
    turma: row.turma,
    observacao: row.observacao || '',
    status: row.status,
    criadoEm: row.criado_em
  };
}

export async function listarReservas(req, res, next) {
  try {
    const usuario = req.usuario;
    const { apenasMinhas, professorId, espacoId, diaSemana, data, semana } = req.query;

    let query = `
      SELECT 
        r.*,
        DATE_FORMAT(r.data, '%Y-%m-%d') as data_formatada,
        p.nome as professor_nome,
        e.nome as espaco_nome
      FROM reservas r
      LEFT JOIN professores p ON r.professor_id = p.id
      LEFT JOIN espacos e ON r.espaco_id = e.id
      WHERE 1=1
    `;
    const params = [];

    // Filtro RBAC: se professor requisitar "apenasMinhas"
    if (usuario && usuario.perfil === 'professor' && (apenasMinhas === 'true' || apenasMinhas === '1')) {
      query += ` AND r.professor_id = ?`;
      params.push(usuario.professorId || usuario.id);
    } else if (professorId) {
      query += ` AND r.professor_id = ?`;
      params.push(Number(professorId));
    }

    if (espacoId) {
      query += ` AND r.espaco_id = ?`;
      params.push(Number(espacoId));
    }

    if (diaSemana) {
      query += ` AND r.dia_semana = ?`;
      params.push(diaSemana);
    }

    if (data) {
      query += ` AND r.data = ?`;
      params.push(data);
    }

    if (semana) {
      query += ` AND r.semana = ?`;
      params.push(semana);
    }

    query += ` ORDER BY r.data DESC, r.horario_inicio ASC`;

    const [linhas] = await pool.query(query, params);
    res.json(linhas.map(formatarReserva));
  } catch (erro) {
    next(erro);
  }
}

export async function obterReservaPorId(req, res, next) {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        r.*,
        DATE_FORMAT(r.data, '%Y-%m-%d') as data_formatada,
        p.nome as professor_nome,
        e.nome as espaco_nome
      FROM reservas r
      LEFT JOIN professores p ON r.professor_id = p.id
      LEFT JOIN espacos e ON r.espaco_id = e.id
      WHERE r.id = ?
    `;

    const [linhas] = await pool.query(query, [id]);

    if (linhas.length === 0) {
      return res.status(404).json({ erro: 'Reserva não encontrada.' });
    }

    res.json(formatarReserva(linhas[0]));
  } catch (erro) {
    next(erro);
  }
}

export async function criarReserva(req, res, next) {
  try {
    const usuario = req.usuario;
    const {
      professorId,
      espacoId,
      equipamentoNome,
      diaSemana,
      data,
      semana,
      horarioInicio,
      horarioFim,
      turma,
      observacao
    } = req.body;

    // Se o usuário logado for professor, a reserva é vinculada obrigatoriamente a ele
    const idDocente = (usuario && usuario.perfil === 'professor')
      ? (usuario.professorId || usuario.id)
      : (Number(professorId) || 1);

    const idEspaco = Number(espacoId);

    // Validações básicas
    if (!idEspaco || !horarioInicio || !horarioFim) {
      return res.status(400).json({ erro: 'Espaço, horário de início e horário de fim são obrigatórios.' });
    }

    // Verificar se docente e espaço existem
    const [docentes] = await pool.query('SELECT * FROM professores WHERE id = ?', [idDocente]);
    const [espacos] = await pool.query('SELECT * FROM espacos WHERE id = ?', [idEspaco]);

    if (docentes.length === 0) {
      return res.status(400).json({ erro: 'Professor informado não existe.' });
    }
    if (espacos.length === 0) {
      return res.status(400).json({ erro: 'Espaço informado não existe.' });
    }

    const docente = docentes[0];
    const espaco = espacos[0];
    const dataReserva = data || new Date().toISOString().split('T')[0];
    const dia = diaSemana || 'Segunda';
    const sem = semana || 'Semana 40';

    // Validação de conflito de horários no banco
    const [conflitos] = await pool.query(
      `SELECT r.id, r.horario_inicio, r.horario_fim, p.nome as professor_nome
       FROM reservas r
       LEFT JOIN professores p ON r.professor_id = p.id
       WHERE r.espaco_id = ?
         AND r.status != 'Cancelada'
         AND (r.data = ? OR (r.dia_semana = ? AND r.semana = ?))
         AND (
           (? >= r.horario_inicio AND ? < r.horario_fim) OR
           (? > r.horario_inicio AND ? <= r.horario_fim) OR
           (? <= r.horario_inicio AND ? >= r.horario_fim)
         )
       LIMIT 1`,
      [
        idEspaco,
        dataReserva,
        dia,
        sem,
        horarioInicio,
        horarioInicio,
        horarioFim,
        horarioFim,
        horarioInicio,
        horarioFim
      ]
    );

    if (conflitos.length > 0) {
      const conflito = conflitos[0];
      const ini = conflito.horario_inicio ? conflito.horario_inicio.substring(0, 5) : '';
      const fim = conflito.horario_fim ? conflito.horario_fim.substring(0, 5) : '';

      return res.status(409).json({
        erro: 'Conflito de agendamento.',
        mensagem: `O espaço "${espaco.nome}" já está reservado por ${conflito.professor_nome} (${ini} - ${fim}).`
      });
    }

    // Inserção da nova reserva
    const [resultado] = await pool.query(
      `INSERT INTO reservas (
        professor_id,
        espaco_id,
        equipamento_nome,
        dia_semana,
        data,
        semana,
        horario_inicio,
        horario_fim,
        turma,
        observacao,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idDocente,
        idEspaco,
        equipamentoNome || 'Nenhum',
        dia,
        dataReserva,
        sem,
        horarioInicio,
        horarioFim,
        turma || 'Turma Regular',
        observacao || '',
        'Confirmada'
      ]
    );

    // Retorna reserva recém criada com os joins
    const [novaLinha] = await pool.query(
      `SELECT 
        r.*,
        DATE_FORMAT(r.data, '%Y-%m-%d') as data_formatada,
        p.nome as professor_nome,
        e.nome as espaco_nome
       FROM reservas r
       LEFT JOIN professores p ON r.professor_id = p.id
       LEFT JOIN espacos e ON r.espaco_id = e.id
       WHERE r.id = ?`,
      [resultado.insertId]
    );

    res.status(201).json(formatarReserva(novaLinha[0]));
  } catch (erro) {
    next(erro);
  }
}

export async function atualizarStatusReserva(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const usuario = req.usuario;

    const [existentes] = await pool.query('SELECT * FROM reservas WHERE id = ?', [id]);
    if (existentes.length === 0) {
      return res.status(404).json({ erro: 'Reserva não encontrada.' });
    }

    const reserva = existentes[0];

    // Se o usuário for professor, só pode cancelar ou alterar a sua própria reserva
    if (usuario && usuario.perfil === 'professor') {
      const profId = usuario.professorId || usuario.id;
      if (reserva.professor_id !== profId) {
        return res.status(403).json({ erro: 'Você só pode alterar o status das suas próprias reservas.' });
      }
    }

    const novoStatus = status || 'Cancelada';
    await pool.query('UPDATE reservas SET status = ? WHERE id = ?', [novoStatus, id]);

    const [atualizado] = await pool.query(
      `SELECT 
        r.*,
        DATE_FORMAT(r.data, '%Y-%m-%d') as data_formatada,
        p.nome as professor_nome,
        e.nome as espaco_nome
       FROM reservas r
       LEFT JOIN professores p ON r.professor_id = p.id
       LEFT JOIN espacos e ON r.espaco_id = e.id
       WHERE r.id = ?`,
      [id]
    );

    res.json(formatarReserva(atualizado[0]));
  } catch (erro) {
    next(erro);
  }
}

export async function excluirReserva(req, res, next) {
  try {
    const { id } = req.params;

    const [existentes] = await pool.query('SELECT id FROM reservas WHERE id = ?', [id]);
    if (existentes.length === 0) {
      return res.status(404).json({ erro: 'Reserva não encontrada.' });
    }

    await pool.query('DELETE FROM reservas WHERE id = ?', [id]);
    res.json({ mensagem: 'Reserva excluída com sucesso.' });
  } catch (erro) {
    next(erro);
  }
}
