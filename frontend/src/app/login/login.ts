import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  // ---------------------------------------------------------------
  // PERSONALIZAÇÃO — troque estes valores pelos definitivos
  // ---------------------------------------------------------------

  @Input() schoolName: string = 'Bicudo Monsenhor';
  @Input() schoolFoundedYear: string = '1961';
  @Input() systemName: string = 'Reserva BM';

  // ---------------------------------------------------------------
  // Estado do formulário
  // ---------------------------------------------------------------

  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(form: any): void {
    if (form.invalid) {
      this.errorMessage = 'Preencha e-mail e senha para continuar.';
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    // TODO: substituir pela chamada real ao serviço de autenticação
    // this.authService.login(this.email, this.password).subscribe(...)
    setTimeout(() => {
      this.isSubmitting = false;
      console.log('Login enviado:', { email: this.email });
    }, 1200);
  }
}