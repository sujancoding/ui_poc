import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatesComponent } from './rates/rates.component';
import { RouterModule } from '@angular/router';
import { RatesRoutes } from './rates.routing';



@NgModule({
  declarations: [
    RatesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(RatesRoutes),
  ]
})
export class RatesModule { }
