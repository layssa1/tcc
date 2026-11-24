import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DataService, Professor as IProfessor } from '../services/data.service';

@Component({
  selector: 'app-professor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './professor.html',
  styleUrl: './professor.scss',
})
export class Professor {
  protected readonly dataService = inject(DataService);
  private readonly router = inject(Router);

  // Search & Filter signals
  readonly busca = signal<string>('');
  readonly filtroStatus = signal<string>('Todos');

  // Modal State (Cadastro / Edição)
  readonly modalAberto = signal<boolean>(false);
  readonly editandoId = signal<number | null>(null);

  // Modal State (Confirmação de Exclusão)
  readonly profParaExcluir = signal<IProfessor | null>(null);

  // Form Fields
  formNome = signal<string>('');
  formRg = signal<string>('');
  formEmail = signal<string>('');
  formDisciplina = signal<string>('');
  formTelefone = signal<string>('');
  formStatus = signal<'Ativo' | 'Inativo'>('Ativo');

  constructor() {
    // Redireciona o professor para o portal do docente caso tente acessar a gestão de professores
    if (this.dataService.isProfessor()) {
      this.dataService.showToast('Acesso restrito à Coordenação Escolar.', 'error');
      this.router.navigate(['/professor-calendario']);
    }
  }

  // Filtered List
  readonly professoresFiltrados = computed(() => {
    const q = this.busca().toLowerCase().trim();
    const st = this.filtroStatus();

    return this.dataService.professores().filter(p => {
      const matchBusca = !q ||
        p.nome.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.disciplina.toLowerCase().includes(q) ||
        p.rg.includes(q);

      const matchStatus = st === 'Todos' || p.status === st;

      return matchBusca && matchStatus;
    });
  });

  abrirModalNovo() {
    if (!this.dataService.isAdmin()) return;
    this.editandoId.set(null);
    this.formNome.set('');
    this.formRg.set('');
    this.formEmail.set('');
    this.formDisciplina.set('');
    this.formTelefone.set('');
    this.formStatus.set('Ativo');
    this.modalAberto.set(true);
  }

  abrirModalEditar(prof: IProfessor) {
    if (!this.dataService.isAdmin()) return;
    this.editandoId.set(prof.id);
    this.formNome.set(prof.nome);
    this.formRg.set(prof.rg);
    this.formEmail.set(prof.email);
    this.formDisciplina.set(prof.disciplina);
    this.formTelefone.set(prof.telefone);
    this.formStatus.set(prof.status);
    this.modalAberto.set(true);
  }

  fecharModal() {
    this.modalAberto.set(false);
    this.editandoId.set(null);
  }

  salvarProfessor() {
    if (!this.dataService.isAdmin()) return;
    const nome = this.formNome().trim();
    if (!nome) {
      this.dataService.showToast('Informe o nome do professor.', 'error');
      return;
    }

    if (this.editandoId()) {
      // Edit
      this.dataService.atualizarProfessor({
        id: this.editandoId()!,
        nome: this.formNome(),
        rg: this.formRg() || 'Não informado',
        email: this.formEmail() || `${nome.toLowerCase().replace(/\s+/g, '.')}@escola.gov.br`,
        disciplina: this.formDisciplina() || 'Geral',
        telefone: this.formTelefone() || '(14) 99999-0000',
        status: this.formStatus()
      });
    } else {
      // Create
      this.dataService.adicionarProfessor({
        nome: this.formNome(),
        rg: this.formRg() || '12.345.678-0',
        email: this.formEmail() || `${nome.toLowerCase().replace(/\s+/g, '.')}@escola.gov.br`,
        disciplina: this.formDisciplina() || 'Ensino Fundamental e Médio',
        telefone: this.formTelefone() || '(14) 99999-0000',
        status: this.formStatus()
      });
    }

    this.fecharModal();
  }

  // Abertura da Modal de Exclusão em vez de confirm()
  confirmarExcluir(prof: IProfessor) {
    if (!this.dataService.isAdmin()) return;
    this.profParaExcluir.set(prof);
  }

  cancelarExclusao() {
    this.profParaExcluir.set(null);
  }

  executarExclusao() {
    if (!this.dataService.isAdmin()) return;
    const prof = this.profParaExcluir();
    if (prof) {
      this.dataService.excluirProfessor(prof.id);
      this.profParaExcluir.set(null);
    }
  }
}
