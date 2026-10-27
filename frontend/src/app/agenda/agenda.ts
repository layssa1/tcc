import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Reserva, Professor, Espaco } from '../services/data.service';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda.html',
  styleUrl: './agenda.scss',
})
export class Agenda {
  protected readonly dataService = inject(DataService);

  readonly semanaNumero = signal<number>(40);
  readonly filtroEspaco = signal<string>('Todos');
  readonly filtroProfessor = signal<string>('Todos');
  readonly filtroTurno = signal<string>('Todos'); // 'Todos', 'Manhã', 'Tarde', 'Noite'

  // Selected reservation for detail modal
  readonly selectedReserva = signal<Reserva | null>(null);
  readonly showDetailModal = signal<boolean>(false);

  // New reservation dialog on slot click
  readonly showNewModal = signal<boolean>(false);
  newDia = signal<string>('Segunda');
  newHorario = signal<string>('08:00');
  newProfId = signal<number>(1);
  newEspacoId = signal<number>(1);
  newEquip = signal<string>('Nenhum');
  newTurma = signal<string>('3º Ano A');

  readonly dias = [
    { nome: 'Segunda', data: '28/09' },
    { nome: 'Terça', data: '29/09' },
    { nome: 'Quarta', data: '30/09' },
    { nome: 'Quinta', data: '01/10' },
    { nome: 'Sexta', data: '02/10' }
  ];

  readonly slots = [
    { turno: 'Manhã', label: '1ª Aula (07:15 - 08:00)', inicio: '07:15', fim: '08:00' },
    { turno: 'Manhã', label: '2ª Aula (08:00 - 08:45)', inicio: '08:00', fim: '08:45' },
    { turno: 'Manhã', label: '3ª Aula (08:45 - 09:30)', inicio: '08:45', fim: '09:30' },
    { turno: 'Manhã', label: '4ª Aula (09:50 - 10:35)', inicio: '09:50', fim: '10:35' },
    { turno: 'Manhã', label: '5ª Aula (10:35 - 11:20)', inicio: '10:35', fim: '11:20' },
    { turno: 'Tarde', label: '6ª Aula (13:15 - 14:00)', inicio: '13:15', fim: '14:00' },
    { turno: 'Tarde', label: '7ª Aula (14:00 - 14:45)', inicio: '14:00', fim: '14:45' },
    { turno: 'Tarde', label: '8ª Aula (15:05 - 15:50)', inicio: '15:05', fim: '15:50' },
    { turno: 'Tarde', label: '9ª Aula (15:50 - 16:35)', inicio: '15:50', fim: '16:35' },
    { turno: 'Noite', label: '10ª Aula (19:00 - 19:50)', inicio: '19:00', fim: '19:50' },
    { turno: 'Noite', label: '11ª Aula (19:50 - 20:40)', inicio: '19:50', fim: '20:40' }
  ];

  readonly filteredSlots = computed(() => {
    if (this.filtroTurno() === 'Todos') return this.slots;
    return this.slots.filter(s => s.turno === this.filtroTurno());
  });

  getReservaForSlot(dia: string, inicio: string): Reserva | undefined {
    return this.dataService.reservas().find(r => {
      if (r.status === 'Cancelada') return false;
      if (r.diaSemana !== dia) return false;
      if (this.filtroEspaco() !== 'Todos' && r.espacoNome !== this.filtroEspaco()) return false;
      if (this.filtroProfessor() !== 'Todos' && r.professorNome !== this.filtroProfessor()) return false;
      // Compare time ranges
      return (r.horarioInicio <= inicio && r.horarioFim > inicio) || (r.horarioInicio === inicio);
    });
  }

  proximaSemana() {
    this.semanaNumero.update(n => n + 1);
  }

  anteriorSemana() {
    if (this.semanaNumero() > 1) {
      this.semanaNumero.update(n => n - 1);
    }
  }

  hoje() {
    this.semanaNumero.set(40);
  }

  abrirDetalhes(reserva: Reserva) {
    this.selectedReserva.set(reserva);
    this.showDetailModal.set(true);
  }

  fecharDetalhes() {
    this.showDetailModal.set(false);
    this.selectedReserva.set(null);
  }

  clicarSlotLivre(dia: string, horarioInicio: string) {
    this.newDia.set(dia);
    this.newHorario.set(horarioInicio);
    const profs = this.dataService.professores();
    const espacos = this.dataService.espacos();
    if (profs.length > 0) this.newProfId.set(profs[0].id);
    if (espacos.length > 0) this.newEspacoId.set(espacos[0].id);
    this.showNewModal.set(true);
  }

  fecharNewModal() {
    this.showNewModal.set(false);
  }

  salvarReservaSlot() {
    const prof = this.dataService.professores().find(p => p.id === Number(this.newProfId()));
    const espaco = this.dataService.espacos().find(e => e.id === Number(this.newEspacoId()));
    if (!prof || !espaco) return;

    const res = this.dataService.adicionarReserva({
      professorId: prof.id,
      professorNome: prof.nome,
      espacoId: espaco.id,
      espacoNome: espaco.nome,
      equipamentoNome: this.newEquip(),
      diaSemana: this.newDia(),
      data: '2026-09-28',
      semana: `Semana ${this.semanaNumero()}`,
      horarioInicio: this.newHorario(),
      horarioFim: this.newHorario() === '08:00' ? '09:30' : '11:20',
      turma: this.newTurma(),
      observacao: 'Agendamento direto via Agenda Semanal',
      status: 'Confirmada'
    });

    if (res.sucesso) {
      this.fecharNewModal();
    }
  }

  cancelarReserva(id: number) {
    this.dataService.cancelarReserva(id);
    this.fecharDetalhes();
  }
}
