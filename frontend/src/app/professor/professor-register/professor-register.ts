import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-professor-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './professor-register.html',
  styleUrl: './professor-register.scss',
})
export class ProfessorRegister {
  private readonly router = inject(Router);
  protected readonly dataService = inject(DataService);

  nome = '';
  rg = '';
  email = '';
  disciplina = '';
  telefone = '';
  status: 'Ativo' | 'Inativo' = 'Ativo';

  salvar() {
    if (!this.nome.trim()) {
      this.dataService.showToast('Informe o nome do professor.', 'error');
      return;
    }

    this.dataService.adicionarProfessor({
      nome: this.nome,
      rg: this.rg || '12.345.678-0',
      email: this.email || `${this.nome.toLowerCase().replace(/\s+/g, '.')}@escola.gov.br`,
      disciplina: this.disciplina || 'Ensino Médio & Fundamental',
      telefone: this.telefone || '(14) 99999-0000',
      status: this.status
    });

    this.router.navigate(['/professor']);
  }
}
