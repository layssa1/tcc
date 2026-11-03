import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reserva-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reserva-register.html',
  styleUrl: './reserva-register.scss',
})
export class ReservaRegister {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly dataService = inject(DataService);

  professorId = 1;
  espacoId = 1;
  equipamentoNome = 'Nenhum';
  diaSemana = 'Segunda';
  data = '2026-09-28';
  semana = 'Semana 40';
  horarioInicio = '08:00';
  horarioFim = '09:40';
  turma = '3º Ano A - Ensino Médio';
  observacao = '';

  constructor() {
    const profs = this.dataService.professores();
    const espacos = this.dataService.espacos();

    // Se o usuário for professor, vincula automaticamente ao seu ID
    const userAtual = this.dataService.usuarioAtual();
    if (userAtual.perfil === 'professor' && userAtual.id) {
      this.professorId = userAtual.id;
    } else if (profs.length > 0) {
      this.professorId = profs[0].id;
    }

    if (espacos.length > 0) this.espacoId = espacos[0].id;

    // Leitura de parâmetros de rota (quando chamado da grade horária)
    this.route.queryParams.subscribe(params => {
      if (params['dia']) this.diaSemana = params['dia'];
      if (params['hora']) {
        this.horarioInicio = params['hora'];
        // Ajusta horário de término baseado em 1h40 de aula
        const [h, m] = params['hora'].split(':').map(Number);
        const fimH = String(h + 1).padStart(2, '0');
        const fimM = String(m + 40 >= 60 ? (m + 40 - 60) : (m + 40)).padStart(2, '0');
        this.horarioFim = `${fimH}:${fimM}`;
      }
    });
  }

  salvar() {
    const prof = this.dataService.professores().find(p => p.id === Number(this.professorId));
    const espaco = this.dataService.espacos().find(e => e.id === Number(this.espacoId));

    if (!prof || !espaco) {
      this.dataService.showToast('Selecione professor e espaço.', 'error');
      return;
    }

    const resultado = this.dataService.adicionarReserva({
      professorId: prof.id,
      professorNome: prof.nome,
      espacoId: espaco.id,
      espacoNome: espaco.nome,
      equipamentoNome: this.equipamentoNome,
      diaSemana: this.diaSemana,
      data: this.data,
      semana: this.semana,
      horarioInicio: this.horarioInicio,
      horarioFim: this.horarioFim,
      turma: this.turma,
      observacao: this.observacao,
      status: 'Confirmada'
    });

    if (resultado.sucesso) {
      if (this.dataService.isProfessor()) {
        this.router.navigate(['/professor-calendario']);
      } else {
        this.router.navigate(['/reserva']);
      }
    }
  }
}