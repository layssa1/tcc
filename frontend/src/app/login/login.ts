import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  email = '';
  senha = '';

  entrar() {
    if (!this.email || !this.senha) {
      alert('Preencha o e-mail e a senha.');
      return;
    }

    console.log('Login:', this.email);
  }
}