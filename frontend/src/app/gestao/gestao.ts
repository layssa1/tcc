import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService, Reserva, Professor, Espaco, Equipamento } from '../services/data.service';

@Component({
  selector: 'app-gestao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './gestao.html',
  styleUrl: './gestao.scss',
})
export class Gestao {
  protected readonly dataService = inject(DataService);

  // Modal de Nova Reserva Express
  readonly showModalNovaReserva = signal<boolean>(false);

  // Form State
  formProfessorId = signal<number | null>(null);
  formEspacoId = signal<number | null>(null);
  formEquipamentoNome = signal<string>('Nenhum');
  formDiaSemana = signal<string>('Segunda');
  formHorarioInicio = signal<string>('08:00');
  formHorarioFim = signal<string>('09:40');
  formTurma = signal<string>('3º Ano A - EM');
  formObservacao = signal<string>('');

  // Filtro de exibição da agenda semanal
  filtroEspacoNome = signal<string>('Todos');

  // Dias e Horários da grade
  diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  horariosGrade = [
    { label: '08:00 - 09:40', inicio: '08:00', fim: '09:40' },
    { label: '10:00 - 11:40', inicio: '10:00', fim: '11:40' },
    { label: '13:30 - 15:10', inicio: '13:30', fim: '15:10' },
    { label: '15:30 - 17:10', inicio: '15:30', fim: '17:10' },
    { label: '19:00 - 20:40', inicio: '19:00', fim: '20:40' }
  ];

  // Helper para buscar reserva em um dia/horário específico
  getReservaSlot(dia: string, horarioInicio: string): Reserva | undefined {
    return this.dataService.reservas().find(r => 
      r.status !== 'Cancelada' &&
      r.diaSemana === dia &&
      r.horarioInicio === horarioInicio &&
      (this.filtroEspacoNome() === 'Todos' || r.espacoNome === this.filtroEspacoNome())
    );
  }

  abrirModalReserva() {
    // Definir valores padrão se disponíveis
    const proflist = this.dataService.professores();
    const espaclist = this.dataService.espacos();
    if (proflist.length > 0) this.formProfessorId.set(proflist[0].id);
    if (espaclist.length > 0) this.formEspacoId.set(espaclist[0].id);
    this.showModalNovaReserva.set(true);
  }

  fecharModalReserva() {
    this.showModalNovaReserva.set(false);
  }

  salvarNovaReserva() {
    const prof = this.dataService.professores().find(p => p.id === Number(this.formProfessorId()));
    const espaco = this.dataService.espacos().find(e => e.id === Number(this.formEspacoId()));

    if (!prof || !espaco) {
      this.dataService.showToast('Selecione o professor e o espaço.', 'error');
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
      this.fecharModalReserva();
    }
  }
}
