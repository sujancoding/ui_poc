
import { dealsMcRoutes } from './dealsmc-routing.module';
import { DealsmcComponent } from './viewdealsmc/dealsmc.component';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/angular-material-module';

import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { ParentNewDealMcComponent } from './parentnewdealsmc/parent-new-deal-mc.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE  } from '@angular/material/core';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MoneyChangerModule } from '../moneychanger.module';

const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};


@NgModule({
  declarations: [
    DealsmcComponent,
    ParentNewDealMcComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(dealsMcRoutes),
    FormsModule, ReactiveFormsModule,
    AngularMaterialModule ,
    FlexLayoutModule,
    SharedModule,
    MatIconModule,
    MoneyChangerModule //--> Money changer module was imported here because we are reusing components inside money changer module for DealsMcModule module .
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ], 
  
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef,  useValue: {}}
  ],

  exports : [
    ParentNewDealMcComponent,DealsmcComponent
  ]

})
export class DealsMcModule { }