import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditScheduleComponent } from './shared/barber-shop/edit-schedule/edit-schedule.component';
import { ListClientsComponent } from './shared/barber-shop/list-clients/list-clients.component';
import { LoginComponent } from './shared/barber-shop/login/login.component';
import { RegisterComponent } from './shared/barber-shop/register/register.component';

const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'list-clients', component: ListClientsComponent},
  {path: 'schedule/:schedule_id', component: EditScheduleComponent},
  {path: 'schedule', component: EditScheduleComponent},
  {path: '', pathMatch: 'full', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
