import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerComponent } from './partner/partner.component';
import { RouterModule } from '@angular/router';
import { PartnerRoutes } from './partnet.routing';



@NgModule({
  declarations: [
    PartnerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(PartnerRoutes)
  ]
})
export class PartnerModule { }
