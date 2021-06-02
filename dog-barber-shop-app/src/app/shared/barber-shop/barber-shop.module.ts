import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ListClientsComponent } from './list-clients/list-clients.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditScheduleComponent } from './edit-schedule/edit-schedule.component';
import { MaterialModule } from 'src/app/core/modules/material/material.module';
import { ViewScheduleComponent } from './view-schedule/view-schedule.component';



@NgModule({
  declarations: [LoginComponent, RegisterComponent, ListClientsComponent, EditScheduleComponent, ViewScheduleComponent],
  imports: [
    CommonModule,
MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [LoginComponent, RegisterComponent, ListClientsComponent, EditScheduleComponent, ViewScheduleComponent]
})
export class BarberShopModule { }
