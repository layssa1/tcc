import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService, Equipamento as IEquipamento } from '../services/data.service';

@Component({
  selector: 'app-equipamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equipamento.html',
  styleUrl: './equipamento.scss',
})
export class Equipamento {
  protected readonly dataService = inject(DataService);

  readonly busca = signal<string>('');
  readonly filtroCategoria = signal<string>('Todos');

  // Modal State
  readonly modalAberto = signal<boolean>(false);
  readonly editandoId = signal<number | null>(null);

  // Form Fields
  formNome = signal<string>('');
  formCategoria = signal<string>('Áudio & Vídeo');
  formQtdTotal = signal<number>(5);
  formQtdDisp = signal<number>(5);
  formStatus = signal<'Disponível' | 'Em uso' | 'Em manutenção'>('Disponível');
  formIcone = signal<string>('📽️');
  formPatrimonio = signal<string>('PAT-2026-');

  readonly equipamentosFiltrados = computed(() => {
    const q = this.busca().toLowerCase().trim();
    const cat = this.filtroCategoria();

    return this.dataService.equipamentos().filter(eq => {
      const matchBusca = !q ||
        eq.nome.toLowerCase().includes(q) ||
        eq.categoria.toLowerCase().includes(q) ||
        eq.patrimonio.toLowerCase().includes(q);

      const matchCat = cat === 'Todos' || eq.categoria === cat;

      return matchBusca && matchCat;
    });
  });

  abrirModalNovo() {
    this.editandoId.set(null);
    this.formNome.set('');
    this.formCategoria.set('Áudio & Vídeo');
    this.formQtdTotal.set(5);
    this.formQtdDisp.set(5);
    this.formStatus.set('Disponível');
    this.formIcone.set('📽️');
    this.formPatrimonio.set(`PAT-2026-${Math.floor(100 + Math.random() * 900)}`);
    this.modalAberto.set(true);
  }

  abrirModalEditar(eq: IEquipamento) {
    this.editandoId.set(eq.id);
    this.formNome.set(eq.nome);
    this.formCategoria.set(eq.categoria);
    this.formQtdTotal.set(eq.quantidadeTotal);
    this.formQtdDisp.set(eq.quantidadeDisponivel);
    this.formStatus.set(eq.status);
    this.formIcone.set(eq.icone);
    this.formPatrimonio.set(eq.patrimonio);
    this.modalAberto.set(true);
  }

  fecharModal() {
    this.modalAberto.set(false);
    this.editandoId.set(null);
  }

  salvarEquipamento() {
    const nome = this.formNome().trim();
    if (!nome) {
      this.dataService.showToast('Informe o nome do equipamento.', 'error');
      return;
    }

    const total = Number(this.formQtdTotal());
    const disp = Number(this.formQtdDisp());

    if (this.editandoId()) {
      this.dataService.atualizarEquipamento({
        id: this.editandoId()!,
        nome: this.formNome(),
        categoria: this.formCategoria(),
        quantidadeTotal: total,
        quantidadeDisponivel: disp,
        status: this.formStatus(),
        icone: this.formIcone() || '💻',
        patrimonio: this.formPatrimonio()
      });
    } else {
      this.dataService.adicionarEquipamento({
        nome: this.formNome(),
        categoria: this.formCategoria(),
        quantidadeTotal: total,
        quantidadeDisponivel: disp,
        status: this.formStatus(),
        icone: this.formIcone() || '💻',
        patrimonio: this.formPatrimonio()
      });
    }

    this.fecharModal();
  }

  ajustarDisp(eq: IEquipamento, delta: number) {
    const novaDisp = eq.quantidadeDisponivel + delta;
    if (novaDisp < 0 || novaDisp > eq.quantidadeTotal) return;

    this.dataService.atualizarEquipamento({
      ...eq,
      quantidadeDisponivel: novaDisp,
      status: novaDisp === 0 ? 'Em uso' : 'Disponível'
    });
  }

  confirmarExcluir(eq: IEquipamento) {
    if (confirm(`Deseja remover o equipamento ${eq.nome}?`)) {
      this.dataService.excluirEquipamento(eq.id);
    }
  }
}
