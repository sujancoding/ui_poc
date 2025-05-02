
import { dailySetupMcRoutes } from './daily-setup-routing.module';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/angular-material-module';

import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE  } from '@angular/material/core';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { RateSetupComponent } from './rate-setup/rate-setup.component';
import { DisplayRatesComponent } from './display-rates/display-rates.component';


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
    RateSetupComponent,
           DisplayRatesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(dailySetupMcRoutes),
    FormsModule, ReactiveFormsModule,
    AngularMaterialModule ,
    FlexLayoutModule,
    SharedModule,
    MatIconModule,
   
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ], 

  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef,  useValue: {}}
  ]

})

export class DailySetupModule { }
