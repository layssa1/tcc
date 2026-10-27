import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-equipamento-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './equipamento-register.html',
  styleUrl: './equipamento-register.scss',
})
export class EquipamentoRegister {
  private readonly router = inject(Router);
  protected readonly dataService = inject(DataService);

  nome = '';
  categoria = 'Áudio & Vídeo';
  quantidadeTotal = 5;
  quantidadeDisponivel = 5;
  status: 'Disponível' | 'Em uso' | 'Em manutenção' = 'Disponível';
  icone = '📽️';
  patrimonio = `PAT-2026-${Math.floor(100 + Math.random() * 900)}`;

  salvar() {
    if (!this.nome.trim()) {
      this.dataService.showToast('Informe o nome do equipamento.', 'error');
      return;
    }

    this.dataService.adicionarEquipamento({
      nome: this.nome,
      categoria: this.categoria,
      quantidadeTotal: Number(this.quantidadeTotal),
      quantidadeDisponivel: Number(this.quantidadeDisponivel),
      status: this.status,
      icone: this.icone,
      patrimonio: this.patrimonio
    });

    this.router.navigate(['/equipamento']);
  }
}
