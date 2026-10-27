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

export const routes: Routes = [
    {path:'', component:Login},
    {path:'gestao', component:Gestao},
    {path:'professor', component:Professor},
    {path:'professor-register', component:ProfessorRegister},
    {path:'espaco', component:Espaco},
    {path:'espaco-register', component:EspacoRegister},
    {path:'equipamento', component:Equipamento},
    {path:'equipamento-register', component:EquipamentoRegister},
    {path:'reserva', component:Reserva},
    {path:'reserva-register', component:ReservaRegister},
    {path:'agenda', component:Agenda}
];
