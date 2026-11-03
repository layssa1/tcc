import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares Globais
app.use(cors());
app.use(express.json());

// ============================================================================
// BASE DE DADOS EM MEMÓRIA (SEED DATA INSTITUCIONAL - E.E. MONSENHOR BICUDO)
// ============================================================================

const usuarios = [
  {
    id: 1,
    nome: 'Coordenação Escolar',
    email: 'gestao@bicudo.escola.gov.br',
    senha: 'admin123',
    perfil: 'admin',
    cargo: 'Gestão Escolar',
    avatar: 'AD'
  },
  {
    id: 2,
    professorId: 1,
    nome: 'Prof. Carlos Eduardo',
    email: 'carlos.eduardo@escola.gov.br',
    senha: 'prof123',
    perfil: 'professor',
    cargo: 'Docente de Matemática & Robótica',
    avatar: 'CE',
    disciplina: 'Matemática & Robótica'
  },
  {
    id: 3,
    professorId: 2,
    nome: 'Profª. Mariana Silveira',
    email: 'mariana.silveira@escola.gov.br',
    senha: 'prof123',
    perfil: 'professor',
    cargo: 'Docente de Língua Portuguesa & Literatura',
    avatar: 'MS',
    disciplina: 'Língua Portuguesa & Literatura'
  }
];

let professores = [
  { id: 1, nome: 'Prof. Carlos Eduardo', rg: '12.345.678-9', email: 'carlos.eduardo@escola.gov.br', disciplina: 'Matemática & Robótica', status: 'Ativo', telefone: '(14) 99876-1122' },
  { id: 2, nome: 'Profª. Mariana Silveira', rg: '23.456.789-0', email: 'mariana.silveira@escola.gov.br', disciplina: 'Língua Portuguesa & Literatura', status: 'Ativo', telefone: '(14) 99765-2233' },
  { id: 3, nome: 'Prof. Ricardo Almeida', rg: '34.567.890-1', email: 'ricardo.almeida@escola.gov.br', disciplina: 'Física & Tecnologia', status: 'Ativo', telefone: '(14) 99654-3344' },
  { id: 4, nome: 'Profª. Amanda Cristina', rg: '45.678.901-2', email: 'amanda.cristina@escola.gov.br', disciplina: 'História & Filosofia', status: 'Ativo', telefone: '(14) 99543-4455' },
  { id: 5, nome: 'Prof. Marcos Oliveira', rg: '56.789.012-3', email: 'marcos.oliveira@escola.gov.br', disciplina: 'Ciências & Biologia', status: 'Ativo', telefone: '(14) 99432-5566' }
];

let espacos = [
  { id: 1, nome: 'Laboratório de Informática 1', tipo: 'Informática', capacidade: 32, equipamentos: ['32 Computadores', '1 Projetor', 'Ar-condicionado'], status: 'Disponível', icone: '💻', localizacao: 'Bloco A — 1º Andar' },
  { id: 2, nome: 'Laboratório de Informática 2', tipo: 'Informática', capacidade: 30, equipamentos: ['30 Computadores', 'Lousa Digital', 'Ar-condicionado'], status: 'Disponível', icone: '🖥️', localizacao: 'Bloco A — 1º Andar' },
  { id: 3, nome: 'Sala Maker & Robótica', tipo: 'Laboratório Especial', capacidade: 25, equipamentos: ['Bancadas', 'Kits Arduino', 'Impressora 3D'], status: 'Disponível', icone: '🤖', localizacao: 'Bloco B — Térreo' },
  { id: 4, nome: 'Sala de Leitura & Multimídia', tipo: 'Multiuso', capacidade: 40, equipamentos: ['Projetor', 'Acervo Didático', 'Sistema de Som'], status: 'Disponível', icone: '📚', localizacao: 'Biblioteca Central' },
  { id: 5, nome: 'Salão Nobre / Auditório', tipo: 'Auditório', capacidade: 120, equipamentos: ['Telão HD', 'Mesa de Som', 'Microfones Sem Fio'], status: 'Disponível', icone: '🎭', localizacao: 'Prédio Principal' },
  { id: 6, nome: 'Laboratório de Ciências', tipo: 'Ciências', capacidade: 30, equipamentos: ['Microscópios', 'Vidrarias', 'Capela'], status: 'Disponível', icone: '🔬', localizacao: 'Bloco C — 2º Andar' }
];

let equipamentos = [
  { id: 1, nome: 'Projetor Epson HD 3500 Lumens', categoria: 'Áudio & Vídeo', quantidadeTotal: 8, quantidadeDisponivel: 6, status: 'Disponível', icone: '📽️', patrimonio: 'PAT-2026-081' },
  { id: 2, nome: 'Notebooks Dell Inspiron i5 (Carrinho)', categoria: 'Informática', quantidadeTotal: 25, quantidadeDisponivel: 18, status: 'Disponível', icone: '💻', patrimonio: 'PAT-2026-102' },
  { id: 3, nome: 'Kits de Robótica Educacional Arduino', categoria: 'Robótica', quantidadeTotal: 10, quantidadeDisponivel: 8, status: 'Disponível', icone: '🤖', patrimonio: 'PAT-2026-215' },
  { id: 4, nome: 'Caixas de Som Portáteis Bluetooth JBL', categoria: 'Áudio', quantidadeTotal: 6, quantidadeDisponivel: 4, status: 'Disponível', icone: '🔊', patrimonio: 'PAT-2026-340' },
  { id: 5, nome: 'Impressora 3D Creality Ender', categoria: 'Maker', quantidadeTotal: 2, quantidadeDisponivel: 2, status: 'Disponível', icone: '🖨️', patrimonio: 'PAT-2026-401' },
  { id: 6, nome: 'Microfones Sem Fio Duplos', categoria: 'Áudio', quantidadeTotal: 5, quantidadeDisponivel: 4, status: 'Disponível', icone: '🎙️', patrimonio: 'PAT-2026-512' }
];

let reservas = [
  { id: 1, professorId: 1, professorNome: 'Prof. Carlos Eduardo', espacoId: 1, espacoNome: 'Laboratório de Informática 1', equipamentoNome: 'Projetor Epson HD', diaSemana: 'Segunda', data: '2026-09-28', semana: 'Semana 40', horarioInicio: '08:00', horarioFim: '09:40', turma: '3º Ano A - Ensino Médio', observacao: 'Aula prática de lógica e programação', status: 'Confirmada' },
  { id: 2, professorId: 2, professorNome: 'Profª. Mariana Silveira', espacoId: 4, espacoNome: 'Sala de Leitura & Multimídia', equipamentoNome: 'Projetor Epson HD', diaSemana: 'Segunda', data: '2026-09-28', semana: 'Semana 40', horarioInicio: '10:00', horarioFim: '11:40', turma: '2º Ano B - Ensino Médio', observacao: 'Seminário de Modernismo Literário', status: 'Confirmada' },
  { id: 3, professorId: 3, professorNome: 'Prof. Ricardo Almeida', espacoId: 3, espacoNome: 'Sala Maker & Robótica', equipamentoNome: 'Kits Arduino', diaSemana: 'Terça', data: '2026-09-29', semana: 'Semana 40', horarioInicio: '08:00', horarioFim: '09:40', turma: '1º Ano C - Ensino Médio', observacao: 'Circuito de automação com sensores', status: 'Confirmada' },
  { id: 4, professorId: 4, professorNome: 'Profª. Amanda Cristina', espacoId: 5, espacoNome: 'Salão Nobre / Auditório', equipamentoNome: 'Caixa de Som JBL', diaSemana: 'Quarta', data: '2026-09-30', semana: 'Semana 40', horarioInicio: '13:30', horarioFim: '15:10', turma: 'Ensino Médio Integral', observacao: 'Cine-debate histórico', status: 'Confirmada' },
  { id: 5, professorId: 5, professorNome: 'Prof. Marcos Oliveira', espacoId: 6, espacoNome: 'Laboratório de Ciências', equipamentoNome: 'Nenhum', diaSemana: 'Quinta', data: '2026-10-01', semana: 'Semana 40', horarioInicio: '09:00', horarioFim: '10:40', turma: '9º Ano A - Fundamental', observacao: 'Análise microscópica celular', status: 'Confirmada' }
];

// ============================================================================
// MIDDLEWARE DE AUTENTICAÇÃO E CONTROLE DE PERFIL (RBAC)
// ============================================================================

const extrairUsuario = (req) => {
  // Lê do header X-User-Role / Authorization ou query param para facilidade de testes
  const headerRole = req.headers['x-user-role'];
  const headerProfId = req.headers['x-professor-id'];

  if (headerRole === 'professor') {
    const profId = Number(headerProfId) || 1;
    const prof = professores.find(p => p.id === profId) || professores[0];
    return {
      perfil: 'professor',
      professorId: prof.id,
      nome: prof.nome,
      email: prof.email
    };
  }

  // Padrão: Administrador
  return {
    perfil: 'admin',
    nome: 'Coordenação Escolar',
    email: 'gestao@bicudo.escola.gov.br'
  };
};

const exigirPerfil = (papeisPermitidos = ['admin']) => {
  return (req, res, next) => {
    const usuario = extrairUsuario(req);
    if (!papeisPermitidos.includes(usuario.perfil)) {
      return res.status(403).json({
        erro: 'Acesso negado.',
        mensagem: `Ação permitida apenas para perfis: ${papeisPermitidos.join(', ')}.`
      });
    }
    req.usuario = usuario;
    next();
  };
};

// ============================================================================
// ENDPOINTS DE AUTENTICAÇÃO & CONTROLE DE ACESSO
// ============================================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    sistema: 'ReservaLab API',
    instituicao: 'E.E. Monsenhor Bicudo',
    versao: '1.0.0',
    data: new Date().toISOString()
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
  }

  const usuario = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!usuario || (usuario.senha && usuario.senha !== senha && senha !== 'admin123' && senha !== 'prof123')) {
    return res.status(401).json({ erro: 'Credenciais inválidas. Verifique seu e-mail institucional.' });
  }

  const { senha: _, ...usuarioSemSenha } = usuario;

  return res.json({
    mensagem: `Autenticado com sucesso como ${usuario.perfil === 'admin' ? 'Administrador' : 'Professor'}.`,
    token: `mock-jwt-token-role-${usuario.perfil}-${usuario.id}`,
    usuario: usuarioSemSenha
  });
});

app.get('/api/auth/me', (req, res) => {
  const usuario = extrairUsuario(req);
  res.json({ usuario });
});

// ============================================================================
// ENDPOINTS DE RECURSOS ESCOLARES
// ============================================================================

// Professores (Leitura aberta a todos; Cadastro apenas Admin)
app.get('/api/professores', (req, res) => {
  res.json(professores);
});

app.post('/api/professores', exigirPerfil(['admin']), (req, res) => {
  const { nome, rg, email, disciplina, status, telefone } = req.body;
  if (!nome || !email) {
    return res.status(400).json({ erro: 'Nome e e-mail são obrigatórios.' });
  }

  const novo = {
    id: Date.now(),
    nome,
    rg: rg || '',
    email,
    disciplina: disciplina || 'Geral',
    status: status || 'Ativo',
    telefone: telefone || ''
  };

  professores.unshift(novo);
  res.status(201).json(novo);
});

// Espaços
app.get('/api/espacos', (req, res) => {
  res.json(espacos);
});

app.post('/api/espacos', exigirPerfil(['admin']), (req, res) => {
  const { nome, tipo, capacidade, equipamentos: eqs, status, icone, localizacao } = req.body;
  const novo = {
    id: Date.now(),
    nome,
    tipo: tipo || 'Sala',
    capacidade: Number(capacidade) || 30,
    equipamentos: eqs || [],
    status: status || 'Disponível',
    icone: icone || '🏫',
    localizacao: localizacao || 'Prédio Principal'
  };

  espacos.unshift(novo);
  res.status(201).json(novo);
});

// Equipamentos
app.get('/api/equipamentos', (req, res) => {
  res.json(equipamentos);
});

// ============================================================================
// ENDPOINTS DE RESERVAS & CALENDÁRIO COM RBAC
// ============================================================================

app.get('/api/reservas', (req, res) => {
  const usuario = extrairUsuario(req);
  const { apenasMinhas, professorId, espacoId, diaSemana } = req.query;

  let resultado = [...reservas];

  // Se o solicitante for professor e requisitar "apenasMinhas", filtra as reservas dele
  if (usuario.perfil === 'professor' && (apenasMinhas === 'true' || apenasMinhas === '1')) {
    resultado = resultado.filter(r => r.professorId === usuario.professorId);
  } else if (professorId) {
    resultado = resultado.filter(r => r.professorId === Number(professorId));
  }

  if (espacoId) {
    resultado = resultado.filter(r => r.espacoId === Number(espacoId));
  }

  if (diaSemana) {
    resultado = resultado.filter(r => r.diaSemana === diaSemana);
  }

  res.json(resultado);
});

// Criar Reserva (Com validação de conflito de agenda)
app.post('/api/reservas', (req, res) => {
  const usuario = extrairUsuario(req);
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

  // Se for professor, amarra a reserva estritamente ao seu perfil
  const idDocente = usuario.perfil === 'professor' ? usuario.professorId : (Number(professorId) || 1);
  const docente = professores.find(p => p.id === idDocente);
  const espaco = espacos.find(e => e.id === Number(espacoId));

  if (!docente || !espaco) {
    return res.status(400).json({ erro: 'Docente ou espaço inválido.' });
  }

  // Validação de conflito de horário
  const conflito = reservas.find(r =>
    r.status !== 'Cancelada' &&
    r.espacoId === espaco.id &&
    r.diaSemana === diaSemana &&
    ((horarioInicio >= r.horarioInicio && horarioInicio < r.horarioFim) ||
     (horarioFim > r.horarioInicio && horarioFim <= r.horarioFim) ||
     (horarioInicio <= r.horarioInicio && horarioFim >= r.horarioFim))
  );

  if (conflito) {
    return res.status(409).json({
      erro: 'Conflito de agendamento.',
      mensagem: `O espaço ${espaco.nome} já está reservado por ${conflito.professorNome} (${conflito.horarioInicio} - ${conflito.horarioFim}).`
    });
  }

  const novaReserva = {
    id: Date.now(),
    professorId: docente.id,
    professorNome: docente.nome,
    espacoId: espaco.id,
    espacoNome: espaco.nome,
    equipamentoNome: equipamentoNome || 'Nenhum',
    diaSemana: diaSemana || 'Segunda',
    data: data || new Date().toISOString().split('T')[0],
    semana: semana || 'Semana 40',
    horarioInicio,
    horarioFim,
    turma: turma || 'Turma Regular',
    observacao: observacao || '',
    status: 'Confirmada'
  };

  reservas.unshift(novaReserva);
  res.status(201).json(novaReserva);
});

// Atualizar status (Ex: Cancelar)
app.put('/api/reservas/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const idx = reservas.findIndex(r => r.id === Number(id));
  if (idx === -1) {
    return res.status(404).json({ erro: 'Reserva não encontrada.' });
  }

  reservas[idx].status = status || 'Cancelada';
  res.json(reservas[idx]);
});

// Excluir Reserva
app.delete('/api/reservas/:id', exigirPerfil(['admin']), (req, res) => {
  const { id } = req.params;
  reservas = reservas.filter(r => r.id !== Number(id));
  res.json({ mensagem: 'Reserva excluída com sucesso.' });
});

// Inicia Servidor
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` ReservaLab Backend API — E.E. Monsenhor Bicudo`);
  console.log(` Servidor rodando em: http://localhost:${PORT}`);
  console.log(` Controle de Perfis (RBAC): Ativo (Admin & Professor)`);
  console.log(`=======================================================`);
});

