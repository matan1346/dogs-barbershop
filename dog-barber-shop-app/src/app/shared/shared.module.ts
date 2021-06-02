import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BarberShopModule } from './barber-shop/barber-shop.module';
import { MaterialModule } from '../core/modules/material/material.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    BarberShopModule,
    ReactiveFormsModule

  ],
})
export class SharedModule { }
