import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private readonly router = inject(Router);
  private readonly dataService = inject(DataService);

  email = 'gestao@bicudo.escola.gov.br';
  senha = '••••••••';
  showPassword = signal<boolean>(false);
  errorMessage = signal<string>('');
  isSubmitting = signal<boolean>(false);

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  fillDemo(type: 'admin' | 'professor') {
    if (type === 'admin') {
      this.email = 'gestao@bicudo.escola.gov.br';
      this.senha = 'admin123';
    } else {
      this.email = 'carlos.eduardo@escola.gov.br';
      this.senha = 'prof123';
    }
    this.errorMessage.set('');
  }

  entrar() {
    if (!this.email || !this.senha) {
      this.errorMessage.set('Por favor, informe seu e-mail institucional e senha.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    // Smooth login transition
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.dataService.showToast('Bem-vindo(a) ao ReservaLab — Gestão Escolar!', 'success');
      this.router.navigate(['/gestao']);
    }, 400);
  }
}