import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-espaco-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './espaco-register.html',
  styleUrl: './espaco-register.scss',
})
export class EspacoRegister {
  private readonly router = inject(Router);
  protected readonly dataService = inject(DataService);

  nome = '';
  tipo = 'Informática';
  capacidade = 30;
  equipamentos = '';
  status: 'Disponível' | 'Ocupado' | 'Em manutenção' = 'Disponível';
  icone = '💻';
  localizacao = 'Bloco A';

  salvar() {
    if (!this.nome.trim()) {
      this.dataService.showToast('Informe o nome do espaço.', 'error');
      return;
    }

    const equips = this.equipamentos
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    this.dataService.adicionarEspaco({
      nome: this.nome,
      tipo: this.tipo,
      capacidade: Number(this.capacidade),
      equipamentos: equips.length > 0 ? equips : ['Equipamentos padrão'],
      status: this.status,
      icone: this.icone,
      localizacao: this.localizacao
    });

    this.router.navigate(['/espaco']);
  }
}
