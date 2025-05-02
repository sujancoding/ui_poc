import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TransactionRoutes } from './transaction.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AngularMaterialModule } from '../angular-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
//import { TransactionProgressComponent } from './all-transactions/transaction-progress/transaction-progress.component';
//import { FilterSearchComponent } from './filter-search/filter-search.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { PayeeCardComponent } from './payee-card/payee-card.component';
import { SharedModule } from '../shared/shared.module';
import { NewSettlementComponent } from './new-settlement/new-settlement.component';
import { SettlementHistoryComponent } from './settlement-history/settlement-history.component';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

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
  //  TransactionProgressComponent,
   // FilterSearchComponent,
    PayeeCardComponent,
    NewSettlementComponent,
    SettlementHistoryComponent,
  
   

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(TransactionRoutes),
    FormsModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    AngularMaterialModule,
    FlexLayoutModule,
    MatCardModule,
    MatDividerModule,
    NgxPaginationModule,
    SharedModule,
   
  
  ],

  providers: [
    { provide: MAT_SNACK_BAR_DATA, useValue: {} },
   
    { provide: MatSnackBarRef, useValue: {} } ,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT }
]

})
export class TransactionModule { }
