import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DataService, Reserva } from '../../services/data.service';

interface SlotHorario {
  id: string;
  turno: 'Manhã' | 'Tarde' | 'Noite';
  horaInicio: string;
  horaFim: string;
  rotulo: string;
}

@Component({
  selector: 'app-professor-calandario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './professor-calandario.html',
  styleUrl: './professor-calandario.scss',
})
export class ProfessorCalandario {
  protected readonly dataService = inject(DataService);
  private readonly router = inject(Router);

  readonly filtroDia = signal<string>('Todos');
  readonly filtroTurno = signal<string>('Todos');
  readonly semanaOffset = signal<number>(0);

  readonly slots: SlotHorario[] = [
    { id: '1', turno: 'Manhã', horaInicio: '07:15', horaFim: '08:00', rotulo: '1ª Aula' },
    { id: '2', turno: 'Manhã', horaInicio: '08:00', horaFim: '08:45', rotulo: '2ª Aula' },
    { id: '3', turno: 'Manhã', horaInicio: '08:45', horaFim: '09:30', rotulo: '3ª Aula' },
    { id: '4', turno: 'Manhã', horaInicio: '09:50', horaFim: '10:35', rotulo: '4ª Aula' },
    { id: '5', turno: 'Manhã', horaInicio: '10:35', horaFim: '11:20', rotulo: '5ª Aula' },
    { id: '6', turno: 'Tarde', horaInicio: '13:00', horaFim: '13:45', rotulo: '6ª Aula' },
    { id: '7', turno: 'Tarde', horaInicio: '13:45', horaFim: '14:30', rotulo: '7ª Aula' },
    { id: '8', turno: 'Tarde', horaInicio: '14:45', horaFim: '15:30', rotulo: '8ª Aula' }
  ];

  readonly diasSemana = [
    { nome: 'Segunda', data: '28/09' },
    { nome: 'Terça', data: '29/09' },
    { nome: 'Quarta', data: '30/09' },
    { nome: 'Quinta', data: '01/10' },
    { nome: 'Sexta', data: '02/10' }
  ];

  readonly slotsFiltrados = computed(() => {
    const turno = this.filtroTurno();
    if (turno === 'Todos') return this.slots;
    return this.slots.filter(s => s.turno === turno);
  });

  readonly diasFiltrados = computed(() => {
    const dia = this.filtroDia();
    if (dia === 'Todos') return this.diasSemana;
    return this.diasSemana.filter(d => d.nome === dia);
  });

  // Retorna a reserva correspondente para o slot e dia informado
  obterReserva(dia: string, horaInicio: string): Reserva | undefined {
    return this.dataService.reservas().find(r => 
      r.status !== 'Cancelada' &&
      r.diaSemana === dia &&
      ((r.horarioInicio <= horaInicio && r.horarioFim > horaInicio) || r.horarioInicio === horaInicio)
    );
  }

  isMinhaReserva(reserva?: Reserva): boolean {
    if (!reserva) return false;
    const user = this.dataService.usuarioAtual();
    if (user.perfil === 'admin') return true;
    if (user.id && reserva.professorId === user.id) return true;
    return reserva.professorNome.toLowerCase().includes(user.nome.toLowerCase());
  }

  solicitarReserva(dia: string, hora: string) {
    this.router.navigate(['/reserva-register'], {
      queryParams: { dia, hora }
    });
  }

  anteriorSemana() {
    this.semanaOffset.update(v => v - 1);
  }

  proximaSemana() {
    this.semanaOffset.update(v => v + 1);
  }

  semanaAtual() {
    this.semanaOffset.set(0);
  }
}
