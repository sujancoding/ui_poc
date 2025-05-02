import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RtPopupWindowsRoutingModule } from './rt-popup-windows-routing.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ProfileModule } from 'src/app/onboarding/onboarding.module';
import { CompanyModule } from 'src/app/onboarding/corporate/profile/company.module';

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
  declarations: [],
  imports: [
    CommonModule,
    RtPopupWindowsRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ProfileModule,
        CompanyModule  
  ],

  providers:[
    { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  ]
})
export class RtPopupWindowsModule { }
