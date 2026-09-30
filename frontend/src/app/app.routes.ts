import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Gestao } from './gestao/gestao';
import { Professor } from './professor/professor';
import { Espaco } from './espaco/espaco';
import { Equipamento } from './equipamento/equipamento';
import { Reserva } from './reserva/reserva';
import { Agenda } from './agenda/agenda';

export const routes: Routes = [
    {path:'', component:Login},
    {path:'gestao', component:Gestao},
    {path:'professor', component:Professor},
    {path:'espaco', component:Espaco},
    {path:'equipamento', component:Equipamento},
    {path:'reserva', component:Reserva},
    {path:'agenda', component:Agenda}
];
