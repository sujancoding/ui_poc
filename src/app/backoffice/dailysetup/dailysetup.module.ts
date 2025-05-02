import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

import { DailySetupRoutingModule } from './dailysetup-routing.module';
import {NgxPaginationModule} from 'ngx-pagination';

import { AngularMaterialModule } from 'src/app/angular-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DealComponent } from './deal-history/deal.component';
import { AddDealComponent } from '../shared/modals/add-deal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DealBookingComponent } from './deal-booking/deal-booking.component';

import { SavedDialogBoxComponent } from '../shared/modals/saved-dialog-box.component';
import { filterAgent } from 'src/app/core/pipe/searchfilter.pipe';
import { CommissionchargesComponent } from './commissioncharges/commissioncharges.component';
import { EditcommissionchargesComponent } from './modals/viewcommission/editcommissioncharges.component';
import { AddCommissionComponent } from './modals/addcommission/add-commission.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewDealSummaryComponent } from './modals/view-deal-summary/view-deal-summary.component';

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
    DealComponent,
    AddDealComponent,
    DealBookingComponent,
    SavedDialogBoxComponent,
    filterAgent,
    CommissionchargesComponent,
    EditcommissionchargesComponent,
    AddCommissionComponent,
    ViewDealSummaryComponent,
    
  
  ],
  imports: [
    CommonModule,
    DailySetupRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    NgxPaginationModule,
    SharedModule,
    
    
  ],
  providers:[CurrencyPipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    {provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ]
})
export class DailySetupModule { }
