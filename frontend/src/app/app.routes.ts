import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Gestao } from './gestao/gestao';
import { Professor } from './professor/professor';
import { Espaco } from './espaco/espaco';
import { Equipamento } from './equipamento/equipamento';
import { Reserva } from './reserva/reserva';
import { Agenda } from './agenda/agenda';
import { ProfessorRegister } from './professor/professor-register/professor-register';
import { EspacoRegister } from './espaco/espaco-register/espaco-register';
import { EquipamentoRegister } from './equipamento/equipamento-register/equipamento-register';
import { ReservaRegister } from './reserva/reserva-register/reserva-register';
import { ProfessorCalandario } from './professor/professor-calandario/professor-calandario';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'gestao', component: Gestao, canActivate: [adminGuard] },
  { path: 'professor', component: Professor, canActivate: [adminGuard] },
  { path: 'professor-register', component: ProfessorRegister, canActivate: [adminGuard] },
  { path: 'espaco', component: Espaco },
  { path: 'espaco-register', component: EspacoRegister, canActivate: [adminGuard] },
  { path: 'equipamento', component: Equipamento },
  { path: 'equipamento-register', component: EquipamentoRegister, canActivate: [adminGuard] },
  { path: 'reserva', component: Reserva },
  { path: 'reserva-register', component: ReservaRegister },
  { path: 'agenda', component: Agenda },
  { path: 'professor-calendario', component: ProfessorCalandario }
];
