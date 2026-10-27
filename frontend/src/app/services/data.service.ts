import { Injectable, signal, computed } from '@angular/core';

export interface Professor {
  id: number;
  nome: string;
  rg: string;
  email: string;
  disciplina: string;
  status: 'Ativo' | 'Inativo';
  telefone: string;
}

export interface Espaco {
  id: number;
  nome: string;
  tipo: string;
  capacidade: number;
  equipamentos: string[];
  status: 'Disponível' | 'Ocupado' | 'Em manutenção';
  icone: string;
  localizacao: string;
}

export interface Equipamento {
  id: number;
  nome: string;
  categoria: string;
  quantidadeTotal: number;
  quantidadeDisponivel: number;
  status: 'Disponível' | 'Em uso' | 'Em manutenção';
  icone: string;
  patrimonio: string;
}

export interface Reserva {
  id: number;
  professorId: number;
  professorNome: string;
  espacoId: number;
  espacoNome: string;
  equipamentoNome: string;
  diaSemana: string; // 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'
  data: string; // YYYY-MM-DD
  semana: string; // 'Semana 40'
  horarioInicio: string; // '08:00'
  horarioFim: string; // '09:00'
  turma: string;
  observacao: string;
  status: 'Confirmada' | 'Pendente' | 'Cancelada';
}

export interface ToastMessage {
  id: number;
  texto: string;
  tipo: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly STORAGE_KEY = 'reservalab_data_v1';

  // Signals for reactive state
  readonly professores = signal<Professor[]>([]);
  readonly espacos = signal<Espaco[]>([]);
  readonly equipamentos = signal<Equipamento[]>([]);
  readonly reservas = signal<Reserva[]>([]);
  readonly toasts = signal<ToastMessage[]>([]);

  // Computed metrics for dashboard
  readonly totalReservas = computed(() => this.reservas().length);
  readonly reservasAtivas = computed(() => this.reservas().filter(r => r.status === 'Confirmada').length);
  readonly totalProfessores = computed(() => this.professores().length);
  readonly professoresAtivos = computed(() => this.professores().filter(p => p.status === 'Ativo').length);
  readonly totalEspacos = computed(() => this.espacos().length);
  readonly espacosDisponiveis = computed(() => this.espacos().filter(e => e.status === 'Disponível').length);
  readonly totalEquipamentos = computed(() => this.equipamentos().reduce((acc, eq) => acc + eq.quantidadeTotal, 0));
  readonly equipamentosDisponiveis = computed(() => this.equipamentos().reduce((acc, eq) => acc + eq.quantidadeDisponivel, 0));

  constructor() {
    this.initData();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private initData() {
    if (this.isBrowser()) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          this.professores.set(parsed.professores || []);
          this.espacos.set(parsed.espacos || []);
          this.equipamentos.set(parsed.equipamentos || []);
          this.reservas.set(parsed.reservas || []);
          return;
        } catch (e) {
          console.error('Erro ao ler cache local:', e);
        }
      }
    }

    // Default Seed Data tailored for E.E. Monsenhor Bicudo
    this.professores.set([
      { id: 1, nome: 'Prof. Carlos Eduardo', rg: '12.345.678-9', email: 'carlos.eduardo@escola.gov.br', disciplina: 'Matemática & Robótica', status: 'Ativo', telefone: '(14) 99876-1122' },
      { id: 2, nome: 'Profª. Mariana Silveira', rg: '23.456.789-0', email: 'mariana.silveira@escola.gov.br', disciplina: 'Língua Portuguesa & Literatura', status: 'Ativo', telefone: '(14) 99765-2233' },
      { id: 3, nome: 'Prof. Ricardo Almeida', rg: '34.567.890-1', email: 'ricardo.almeida@escola.gov.br', disciplina: 'Física & Tecnologia', status: 'Ativo', telefone: '(14) 99654-3344' },
      { id: 4, nome: 'Profª. Amanda Cristina', rg: '45.678.901-2', email: 'amanda.cristina@escola.gov.br', disciplina: 'História & Filosofia', status: 'Ativo', telefone: '(14) 99543-4455' },
      { id: 5, nome: 'Prof. Marcos Oliveira', rg: '56.789.012-3', email: 'marcos.oliveira@escola.gov.br', disciplina: 'Ciências & Biologia', status: 'Ativo', telefone: '(14) 99432-5566' }
    ]);

    this.espacos.set([
      { id: 1, nome: 'Laboratório de Informática 1', tipo: 'Informática', capacidade: 32, equipamentos: ['32 Computadores', '1 Projetor', 'Ar-condicionado'], status: 'Disponível', icone: '💻', localizacao: 'Bloco A — 1º Andar' },
      { id: 2, nome: 'Laboratório de Informática 2', tipo: 'Informática', capacidade: 30, equipamentos: ['30 Computadores', 'Lousa Digital', 'Ar-condicionado'], status: 'Disponível', icone: '🖥️', localizacao: 'Bloco A — 1º Andar' },
      { id: 3, nome: 'Sala Maker & Robótica', tipo: 'Laboratório Especial', capacidade: 25, equipamentos: ['Bancadas', 'Kits Arduino', 'Impressora 3D'], status: 'Disponível', icone: '🤖', localizacao: 'Bloco B — Térreo' },
      { id: 4, nome: 'Sala de Leitura & Multimídia', tipo: 'Multiuso', capacidade: 40, equipamentos: ['Projetor', 'Acervo Didático', 'Sistema de Som'], status: 'Disponível', icone: '📚', localizacao: 'Biblioteca Central' },
      { id: 5, nome: 'Salão Nobre / Auditório', tipo: 'Auditório', capacidade: 120, equipamentos: ['Telão HD', 'Mesa de Som', 'Microfones Sem Fio'], status: 'Disponível', icone: '🎭', localizacao: 'Prédio Principal' },
      { id: 6, nome: 'Laboratório de Ciências', tipo: 'Ciências', capacidade: 30, equipamentos: ['Microscópios', 'Vidrarias', 'Capela'], status: 'Disponível', icone: '🔬', localizacao: 'Bloco C — 2º Andar' }
    ]);

    this.equipamentos.set([
      { id: 1, nome: 'Projetor Epson HD 3500 Lumens', categoria: 'Áudio & Vídeo', quantidadeTotal: 8, quantidadeDisponivel: 6, status: 'Disponível', icone: '📽️', patrimonio: 'PAT-2026-081' },
      { id: 2, nome: 'Notebooks Dell Inspiron i5 (Carrinho)', categoria: 'Informática', quantidadeTotal: 25, quantidadeDisponivel: 18, status: 'Disponível', icone: '💻', patrimonio: 'PAT-2026-102' },
      { id: 3, nome: 'Kits de Robótica Educacional Arduino', categoria: 'Robótica', quantidadeTotal: 10, quantidadeDisponivel: 8, status: 'Disponível', icone: '🤖', patrimonio: 'PAT-2026-215' },
      { id: 4, nome: 'Caixas de Som Portáteis Bluetooth JBL', categoria: 'Áudio', quantidadeTotal: 6, quantidadeDisponivel: 4, status: 'Disponível', icone: '🔊', patrimonio: 'PAT-2026-340' },
      { id: 5, nome: 'Impressora 3D Creality Ender', categoria: 'Maker', quantidadeTotal: 2, quantidadeDisponivel: 2, status: 'Disponível', icone: '🖨️', patrimonio: 'PAT-2026-401' },
      { id: 6, nome: 'Microfones Sem Fio Duplos', categoria: 'Áudio', quantidadeTotal: 5, quantidadeDisponivel: 4, status: 'Disponível', icone: '🎙️', patrimonio: 'PAT-2026-512' }
    ]);

    this.reservas.set([
      { id: 1, professorId: 1, professorNome: 'Prof. Carlos Eduardo', espacoId: 1, espacoNome: 'Laboratório de Informática 1', equipamentoNome: 'Projetor Epson HD', diaSemana: 'Segunda', data: '2026-09-28', semana: 'Semana 40', horarioInicio: '08:00', horarioFim: '09:40', turma: '3º Ano A - Ensino Médio', observacao: 'Aula prática de lógica e programação', status: 'Confirmada' },
      { id: 2, professorId: 2, professorNome: 'Profª. Mariana Silveira', espacoId: 4, espacoNome: 'Sala de Leitura & Multimídia', equipamentoNome: 'Projetor Epson HD', diaSemana: 'Segunda', data: '2026-09-28', semana: 'Semana 40', horarioInicio: '10:00', horarioFim: '11:40', turma: '2º Ano B - Ensino Médio', observacao: 'Seminário de Modernismo Literário', status: 'Confirmada' },
      { id: 3, professorId: 3, professorNome: 'Prof. Ricardo Almeida', espacoId: 3, espacoNome: 'Sala Maker & Robótica', equipamentoNome: 'Kits Arduino', diaSemana: 'Terça', data: '2026-09-29', semana: 'Semana 40', horarioInicio: '08:00', horarioFim: '09:40', turma: '1º Ano C - Ensino Médio', observacao: 'Circuito de automação com sensores', status: 'Confirmada' },
      { id: 4, professorId: 4, professorNome: 'Profª. Amanda Cristina', espacoId: 5, espacoNome: 'Salão Nobre / Auditório', equipamentoNome: 'Caixa de Som JBL', diaSemana: 'Quarta', data: '2026-09-30', semana: 'Semana 40', horarioInicio: '13:30', horarioFim: '15:10', turma: 'Ensino Médio Integral', observacao: 'Cine-debate histórico', status: 'Confirmada' },
      { id: 5, professorId: 5, professorNome: 'Prof. Marcos Oliveira', espacoId: 6, espacoNome: 'Laboratório de Ciências', equipamentoNome: 'Nenhum', diaSemana: 'Quinta', data: '2026-10-01', semana: 'Semana 40', horarioInicio: '09:00', horarioFim: '10:40', turma: '9º Ano A - Fundamental', observacao: 'Análise microscópica celular', status: 'Confirmada' }
    ]);

    this.saveData();
  }

  private saveData() {
    if (this.isBrowser()) {
      const payload = {
        professores: this.professores(),
        espacos: this.espacos(),
        equipamentos: this.equipamentos(),
        reservas: this.reservas()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
    }
  }

  // Toast notifications
  showToast(texto: string, tipo: 'success' | 'error' | 'info' = 'success') {
    const id = Date.now();
    this.toasts.update(current => [...current, { id, texto, tipo }]);
    setTimeout(() => {
      this.toasts.update(current => current.filter(t => t.id !== id));
    }, 3500);
  }

  removeToast(id: number) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }

  // Professores CRUD
  adicionarProfessor(novo: Omit<Professor, 'id'>) {
    const id = Date.now();
    const prof: Professor = { ...novo, id };
    this.professores.update(list => [prof, ...list]);
    this.saveData();
    this.showToast(`Professor(a) ${prof.nome} cadastrado com sucesso!`);
    return prof;
  }

  atualizarProfessor(atualizado: Professor) {
    this.professores.update(list => list.map(p => p.id === atualizado.id ? atualizado : p));
    this.saveData();
    this.showToast(`Cadastro de ${atualizado.nome} atualizado!`);
  }

  excluirProfessor(id: number) {
    const prof = this.professores().find(p => p.id === id);
    this.professores.update(list => list.filter(p => p.id !== id));
    this.saveData();
    this.showToast(`Professor ${prof ? prof.nome : ''} removido.`);
  }

  // Espaços CRUD
  adicionarEspaco(novo: Omit<Espaco, 'id'>) {
    const id = Date.now();
    const espaco: Espaco = { ...novo, id };
    this.espacos.update(list => [espaco, ...list]);
    this.saveData();
    this.showToast(`Espaço ${espaco.nome} criado com sucesso!`);
    return espaco;
  }

  atualizarEspaco(atualizado: Espaco) {
    this.espacos.update(list => list.map(e => e.id === atualizado.id ? atualizado : e));
    this.saveData();
    this.showToast(`Espaço ${atualizado.nome} atualizado!`);
  }

  excluirEspaco(id: number) {
    const item = this.espacos().find(e => e.id === id);
    this.espacos.update(list => list.filter(e => e.id !== id));
    this.saveData();
    this.showToast(`Espaço ${item ? item.nome : ''} excluído.`);
  }

  // Equipamentos CRUD
  adicionarEquipamento(novo: Omit<Equipamento, 'id'>) {
    const id = Date.now();
    const equipamento: Equipamento = { ...novo, id };
    this.equipamentos.update(list => [equipamento, ...list]);
    this.saveData();
    this.showToast(`Equipamento ${equipamento.nome} cadastrado!`);
    return equipamento;
  }

  atualizarEquipamento(atualizado: Equipamento) {
    this.equipamentos.update(list => list.map(eq => eq.id === atualizado.id ? atualizado : eq));
    this.saveData();
    this.showToast(`Equipamento ${atualizado.nome} atualizado!`);
  }

  excluirEquipamento(id: number) {
    const item = this.equipamentos().find(eq => eq.id === id);
    this.equipamentos.update(list => list.filter(eq => eq.id !== id));
    this.saveData();
    this.showToast(`Equipamento removido.`);
  }

  // Reservas CRUD
  adicionarReserva(nova: Omit<Reserva, 'id'>): { sucesso: boolean; mensagem?: string } {
    // Conflict verification
    const conflito = this.reservas().find(r => 
      r.status !== 'Cancelada' &&
      r.espacoId === nova.espacoId &&
      r.diaSemana === nova.diaSemana &&
      r.semana === nova.semana &&
      ((nova.horarioInicio >= r.horarioInicio && nova.horarioInicio < r.horarioFim) ||
       (nova.horarioFim > r.horarioInicio && nova.horarioFim <= r.horarioFim) ||
       (nova.horarioInicio <= r.horarioInicio && nova.horarioFim >= r.horarioFim))
    );

    if (conflito) {
      const msg = `Conflito de horário! O espaço ${nova.espacoNome} já está reservado por ${conflito.professorNome} (${conflito.horarioInicio} - ${conflito.horarioFim}).`;
      this.showToast(msg, 'error');
      return { sucesso: false, mensagem: msg };
    }

    const id = Date.now();
    const reserva: Reserva = { ...nova, id };
    this.reservas.update(list => [reserva, ...list]);
    this.saveData();
    this.showToast(`Reserva para ${reserva.espacoNome} confirmada!`);
    return { sucesso: true };
  }

  cancelarReserva(id: number) {
    this.reservas.update(list => list.map(r => r.id === id ? { ...r, status: 'Cancelada' } : r));
    this.saveData();
    this.showToast(`Reserva cancelada com sucesso.`);
  }

  excluirReserva(id: number) {
    this.reservas.update(list => list.filter(r => r.id !== id));
    this.saveData();
    this.showToast(`Reserva excluída.`);
  }
}
