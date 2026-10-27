import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService, Espaco as IEspaco } from '../services/data.service';

@Component({
  selector: 'app-espaco',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './espaco.html',
  styleUrl: './espaco.scss',
})
export class Espaco {
  protected readonly dataService = inject(DataService);

  readonly busca = signal<string>('');
  readonly filtroTipo = signal<string>('Todos');
  readonly visualizacao = signal<'grid' | 'tabela'>('grid');

  // Modal State
  readonly modalAberto = signal<boolean>(false);
  readonly editandoId = signal<number | null>(null);

  // Form Fields
  formNome = signal<string>('');
  formTipo = signal<string>('Informática');
  formCapacidade = signal<number>(30);
  formEquipamentos = signal<string>('Computadores, Projetor');
  formStatus = signal<'Disponível' | 'Ocupado' | 'Em manutenção'>('Disponível');
  formIcone = signal<string>('💻');
  formLocalizacao = signal<string>('Bloco A');

  readonly espacosFiltrados = computed(() => {
    const q = this.busca().toLowerCase().trim();
    const tp = this.filtroTipo();

    return this.dataService.espacos().filter(e => {
      const matchBusca = !q ||
        e.nome.toLowerCase().includes(q) ||
        e.tipo.toLowerCase().includes(q) ||
        e.localizacao.toLowerCase().includes(q);

      const matchTipo = tp === 'Todos' || e.tipo === tp;

      return matchBusca && matchTipo;
    });
  });

  abrirModalNovo() {
    this.editandoId.set(null);
    this.formNome.set('');
    this.formTipo.set('Informática');
    this.formCapacidade.set(30);
    this.formEquipamentos.set('Computadores, Projetor');
    this.formStatus.set('Disponível');
    this.formIcone.set('💻');
    this.formLocalizacao.set('Bloco A');
    this.modalAberto.set(true);
  }

  abrirModalEditar(espaco: IEspaco) {
    this.editandoId.set(espaco.id);
    this.formNome.set(espaco.nome);
    this.formTipo.set(espaco.tipo);
    this.formCapacidade.set(espaco.capacidade);
    this.formEquipamentos.set(espaco.equipamentos.join(', '));
    this.formStatus.set(espaco.status);
    this.formIcone.set(espaco.icone);
    this.formLocalizacao.set(espaco.localizacao);
    this.modalAberto.set(true);
  }

  fecharModal() {
    this.modalAberto.set(false);
    this.editandoId.set(null);
  }

  salvarEspaco() {
    const nome = this.formNome().trim();
    if (!nome) {
      this.dataService.showToast('Informe o nome do espaço.', 'error');
      return;
    }

    const equips = this.formEquipamentos()
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (this.editandoId()) {
      this.dataService.atualizarEspaco({
        id: this.editandoId()!,
        nome: this.formNome(),
        tipo: this.formTipo(),
        capacidade: Number(this.formCapacidade()),
        equipamentos: equips,
        status: this.formStatus(),
        icone: this.formIcone() || '🏫',
        localizacao: this.formLocalizacao()
      });
    } else {
      this.dataService.adicionarEspaco({
        nome: this.formNome(),
        tipo: this.formTipo(),
        capacidade: Number(this.formCapacidade()),
        equipamentos: equips,
        status: this.formStatus(),
        icone: this.formIcone() || '🏫',
        localizacao: this.formLocalizacao()
      });
    }

    this.fecharModal();
  }

  confirmarExcluir(espaco: IEspaco) {
    if (confirm(`Deseja remover o espaço ${espaco.nome}?`)) {
      this.dataService.excluirEspaco(espaco.id);
    }
  }
}
