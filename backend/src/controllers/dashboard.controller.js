import pool from '../config/db.js';

export async function obterMetricas(req, res, next) {
  try {
    const [[contagemReservas]] = await pool.query(
      `SELECT 
        COUNT(*) as totalReservas,
        SUM(CASE WHEN status = 'Confirmada' THEN 1 ELSE 0 END) as reservasAtivas,
        SUM(CASE WHEN status = 'Cancelada' THEN 1 ELSE 0 END) as reservasCanceladas
       FROM reservas`
    );

    const [[contagemProfessores]] = await pool.query(
      `SELECT 
        COUNT(*) as totalProfessores,
        SUM(CASE WHEN status = 'Ativo' THEN 1 ELSE 0 END) as professoresAtivos
       FROM professores`
    );

    const [[contagemEspacos]] = await pool.query(
      `SELECT 
        COUNT(*) as totalEspacos,
        SUM(CASE WHEN status = 'Disponível' THEN 1 ELSE 0 END) as espacosDisponiveis
       FROM espacos`
    );

    const [[contagemEquipamentos]] = await pool.query(
      `SELECT 
        COALESCE(SUM(quantidade_total), 0) as totalEquipamentos,
        COALESCE(SUM(quantidade_disponivel), 0) as equipamentosDisponiveis
       FROM equipamentos`
    );

    const [ultimasReservas] = await pool.query(
      `SELECT 
        r.id,
        p.nome as professorNome,
        e.nome as espacoNome,
        r.equipamento_nome as equipamentoNome,
        r.dia_semana as diaSemana,
        DATE_FORMAT(r.data, '%Y-%m-%d') as data,
        DATE_FORMAT(r.horario_inicio, '%H:%i') as horarioInicio,
        DATE_FORMAT(r.horario_fim, '%H:%i') as horarioFim,
        r.turma,
        r.status
       FROM reservas r
       LEFT JOIN professores p ON r.professor_id = p.id
       LEFT JOIN espacos e ON r.espaco_id = e.id
       ORDER BY r.criado_em DESC
       LIMIT 5`
    );

    res.json({
      totalReservas: Number(contagemReservas.totalReservas) || 0,
      reservasAtivas: Number(contagemReservas.reservasAtivas) || 0,
      reservasCanceladas: Number(contagemReservas.reservasCanceladas) || 0,
      totalProfessores: Number(contagemProfessores.totalProfessores) || 0,
      professoresAtivos: Number(contagemProfessores.professoresAtivos) || 0,
      totalEspacos: Number(contagemEspacos.totalEspacos) || 0,
      espacosDisponiveis: Number(contagemEspacos.espacosDisponiveis) || 0,
      totalEquipamentos: Number(contagemEquipamentos.totalEquipamentos) || 0,
      equipamentosDisponiveis: Number(contagemEquipamentos.equipamentosDisponiveis) || 0,
      ultimasReservas
    });
  } catch (erro) {
    next(erro);
  }
}
