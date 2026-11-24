import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Reserva {
  id: number;
  professor: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  espaco: string;
  equipamento: string;
  status: string;
  finalidade: string;
  observacoes: string;
}

@Component({
  selector: 'app-reserva-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-register.html',
  styleUrl: './reserva-register.scss',
})
export class ReservaRegister {

  // Controla a abertura do formulário
  cadastroAberto = false;

  // Filtros da tabela
  filtroData = '';
  filtroEspaco = '';
  filtroStatus = '';

  // Identifica se uma reserva está sendo editada
  reservaEditandoId: number | null = null;

  // Dados do formulário
  reserva: Reserva = this.novaReserva();

  // Reservas cadastradas
  reservas: Reserva[] = [
    {
      id: 1,
      professor: 'João da Silva',
      data: '2026-09-30',
      horaInicio: '08:00',
      horaFim: '10:00',
      espaco: 'sala-01',
      equipamento: 'projetor',
      status: 'confirmada',
      finalidade: 'Aula de matemática',
      observacoes: ''
    },
    {
      id: 2,
      professor: 'Maria Oliveira',
      data: '2026-09-30',
      horaInicio: '13:00',
      horaFim: '15:00',
      espaco: 'laboratorio',
      equipamento: 'notebook',
      status: 'pendente',
      finalidade: 'Aula prática',
      observacoes: ''
    }
  ];

  // Professores disponíveis
  professores = [
    { valor: 'joao', nome: 'João da Silva' },
    { valor: 'maria', nome: 'Maria Oliveira' },
    { valor: 'carlos', nome: 'Carlos Santos' }
  ];

  // Espaços disponíveis
  espacos = [
    { valor: 'sala-01', nome: 'Sala 01' },
    { valor: 'sala-02', nome: 'Sala 02' },
    { valor: 'laboratorio', nome: 'Laboratório' },
    { valor: 'auditorio', nome: 'Auditório' },
    { valor: 'quadra', nome: 'Quadra esportiva' }
  ];

  // Equipamentos disponíveis
  equipamentos = [
    { valor: 'projetor', nome: 'Projetor' },
    { valor: 'notebook', nome: 'Notebook' },
    { valor: 'caixa-som', nome: 'Caixa de som' },
    { valor: 'microfone', nome: 'Microfone' }
  ];

  // Cria um formulário vazio
  private novaReserva(): Reserva {
    return {
      id: 0,
      professor: '',
      data: '',
      horaInicio: '',
      horaFim: '',
      espaco: '',
      equipamento: '',
      status: 'pendente',
      finalidade: '',
      observacoes: ''
    };
  }

  // Abre o formulário de cadastro
  abrirCadastro(): void {
    this.reserva = this.novaReserva();
    this.reservaEditandoId = null;
    this.cadastroAberto = true;
  }

  // Fecha o formulário
  fecharCadastro(): void {
    this.cadastroAberto = false;
    this.reserva = this.novaReserva();
    this.reservaEditandoId = null;
  }

  // Cadastra ou atualiza uma reserva
  cadastrarReserva(): void {
    if (
      !this.reserva.professor ||
      !this.reserva.data ||
      !this.reserva.horaInicio ||
      !this.reserva.horaFim ||
      !this.reserva.espaco
    ) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (this.reserva.horaFim <= this.reserva.horaInicio) {
      alert('O horário final deve ser posterior ao horário inicial.');
      return;
    }

    // Verifica se o espaço já está reservado no mesmo horário
    const conflito = this.reservas.some(item =>
      item.id !== this.reservaEditandoId &&
      item.data === this.reserva.data &&
      item.espaco === this.reserva.espaco &&
      this.reserva.horaInicio < item.horaFim &&
      this.reserva.horaFim > item.horaInicio &&
      item.status !== 'cancelada'
    );

    if (conflito) {
      alert('Este espaço já possui uma reserva nesse horário.');
      return;
    }

    if (this.reservaEditandoId !== null) {
      const indice = this.reservas.findIndex(
        item => item.id === this.reservaEditandoId
      );

      if (indice !== -1) {
        this.reservas[indice] = {
          ...this.reserva,
          id: this.reservaEditandoId
        };
      }

      alert('Reserva atualizada com sucesso!');
    } else {
      const nova: Reserva = {
        ...this.reserva,
        id: this.proximoId()
      };

      this.reservas.push(nova);
      alert('Reserva cadastrada com sucesso!');
    }

    this.fecharCadastro();
  }

  // Gera um identificador para a nova reserva
  private proximoId(): number {
    return this.reservas.length > 0
      ? Math.max(...this.reservas.map(item => item.id)) + 1
      : 1;
  }

  // Abre o formulário para editar uma reserva
  editarReserva(id: number): void {
    const encontrada = this.reservas.find(item => item.id === id);

    if (!encontrada) {
      alert('Reserva não encontrada.');
      return;
    }

    this.reserva = { ...encontrada };
    this.reservaEditandoId = id;
    this.cadastroAberto = true;
  }

  // Exclui uma reserva
  excluirReserva(id: number): void {
    const confirmar = confirm(
      'Tem certeza de que deseja excluir esta reserva?'
    );

    if (!confirmar) {
      return;
    }

    this.reservas = this.reservas.filter(item => item.id !== id);

    alert('Reserva excluída com sucesso!');
  }

  // Converte o código do espaço para o nome exibido
  nomeEspaco(valor: string): string {
    return this.espacos.find(item => item.valor === valor)?.nome ?? valor;
  }

  // Converte o código do equipamento para o nome exibido
  nomeEquipamento(valor: string): string {
    return this.equipamentos.find(item => item.valor === valor)?.nome
      ?? valor
      ?? 'Nenhum equipamento';
  }

  // Converte o código do professor para o nome exibido
  nomeProfessor(valor: string): string {
    return this.professores.find(item => item.valor === valor)?.nome ?? valor;
  }

  // Lista de reservas de acordo com os filtros
  get reservasFiltradas(): Reserva[] {
    return this.reservas.filter(item => {
      const correspondeData =
        !this.filtroData || item.data === this.filtroData;

      const correspondeEspaco =
        !this.filtroEspaco || item.espaco === this.filtroEspaco;

      const correspondeStatus =
        !this.filtroStatus || item.status === this.filtroStatus;

      return correspondeData && correspondeEspaco && correspondeStatus;
    });
  }
}