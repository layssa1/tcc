import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService, Reserva as IReserva } from '../services/data.service';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva.html',
  styleUrl: './reserva.scss',
})
export class Reserva {
  protected readonly dataService = inject(DataService);

  readonly busca = signal<string>('');
  readonly filtroEspaco = signal<string>('Todos');
  readonly filtroProfessor = signal<string>('Todos');
  readonly filtroStatus = signal<string>('Todos');

  // Modal State (Nova Reserva)
  readonly modalAberto = signal<boolean>(false);

  // Modais de Confirmação (Substituem alert/confirm)
  readonly reservaParaCancelar = signal<IReserva | null>(null);
  readonly reservaParaExcluir = signal<IReserva | null>(null);

  // Form State
  formProfessorId = signal<number>(1);
  formEspacoId = signal<number>(1);
  formEquipamentoNome = signal<string>('Nenhum');
  formDiaSemana = signal<string>('Segunda');
  formHorarioInicio = signal<string>('08:00');
  formHorarioFim = signal<string>('09:40');
  formTurma = signal<string>('2º Ano A - EM');
  formObservacao = signal<string>('');

  readonly apenasMinhas = signal<boolean>(true);

  readonly reservasFiltradas = computed(() => {
    const q = this.busca().toLowerCase().trim();
    const esp = this.filtroEspaco();
    const prof = this.filtroProfessor();
    const st = this.filtroStatus();
    const isProf = this.dataService.isProfessor();
    const apenasMinhasAtivo = this.apenasMinhas();
    const user = this.dataService.usuarioAtual();

    return this.dataService.reservas().filter(r => {
      if (isProf && apenasMinhasAtivo) {
        const ehDele = (user.id && r.professorId === user.id) || 
                       r.professorNome.toLowerCase().includes(user.nome.toLowerCase());
        if (!ehDele) return false;
      }

      const matchBusca = !q ||
        r.professorNome.toLowerCase().includes(q) ||
        r.espacoNome.toLowerCase().includes(q) ||
        r.turma.toLowerCase().includes(q) ||
        (r.equipamentoNome && r.equipamentoNome.toLowerCase().includes(q));

      const matchEsp = esp === 'Todos' || r.espacoNome === esp;
      const matchProf = prof === 'Todos' || r.professorNome === prof;
      const matchSt = st === 'Todos' || r.status === st;

      return matchBusca && matchEsp && matchProf && matchSt;
    });
  });

  podeCancelar(res: IReserva): boolean {
    if (this.dataService.isAdmin()) return true;
    const user = this.dataService.usuarioAtual();
    return (user.id && res.professorId === user.id) ||
           res.professorNome.toLowerCase().includes(user.nome.toLowerCase());
  }

  abrirModalNovo() {
    const profs = this.dataService.professores();
    const espacos = this.dataService.espacos();
    const user = this.dataService.usuarioAtual();

    if (this.dataService.isProfessor() && user.id) {
      this.formProfessorId.set(user.id);
    } else if (profs.length > 0) {
      this.formProfessorId.set(profs[0].id);
    }

    if (espacos.length > 0) this.formEspacoId.set(espacos[0].id);
    this.modalAberto.set(true);
  }

  fecharModal() {
    this.modalAberto.set(false);
  }

  salvarReserva() {
    const prof = this.dataService.professores().find(p => p.id === Number(this.formProfessorId()));
    const espaco = this.dataService.espacos().find(e => e.id === Number(this.formEspacoId()));

    if (!prof || !espaco) {
      this.dataService.showToast('Selecione professor e espaço.', 'error');
      return;
    }

    const resultado = this.dataService.adicionarReserva({
      professorId: prof.id,
      professorNome: prof.nome,
      espacoId: espaco.id,
      espacoNome: espaco.nome,
      equipamentoNome: this.formEquipamentoNome(),
      diaSemana: this.formDiaSemana(),
      data: '2026-09-28',
      semana: 'Semana 40',
      horarioInicio: this.formHorarioInicio(),
      horarioFim: this.formHorarioFim(),
      turma: this.formTurma(),
      observacao: this.formObservacao(),
      status: 'Confirmada'
    });

    if (resultado.sucesso) {
      this.fecharModal();
    }
  }

  // Abertura da Modal para Cancelar
  solicitarCancelar(res: IReserva) {
    if (!this.podeCancelar(res)) {
      this.dataService.showToast('Você só pode cancelar suas próprias reservas.', 'error');
      return;
    }
    this.reservaParaCancelar.set(res);
  }

  fecharModalCancelar() {
    this.reservaParaCancelar.set(null);
  }

  executarCancelamento() {
    const res = this.reservaParaCancelar();
    if (res) {
      this.dataService.cancelarReserva(res.id);
      this.reservaParaCancelar.set(null);
    }
  }

  // Abertura da Modal para Excluir Permanentemente (Apenas Administrador)
  solicitarExcluir(res: IReserva) {
    if (!this.dataService.isAdmin()) return;
    this.reservaParaExcluir.set(res);
  }

  fecharModalExcluir() {
    this.reservaParaExcluir.set(null);
  }

  executarExclusao() {
    if (!this.dataService.isAdmin()) return;
    const res = this.reservaParaExcluir();
    if (res) {
      this.dataService.excluirReserva(res.id);
      this.reservaParaExcluir.set(null);
    }
  }
}
