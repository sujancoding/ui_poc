import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicreportComponent } from './basicreport/basicreport.component';
import { RouterModule } from '@angular/router';
import { ReportsRoutes } from './reports.routing';



@NgModule({
  declarations: [
    BasicreportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ReportsRoutes),

  ]
})
export class ReportsModule { }
