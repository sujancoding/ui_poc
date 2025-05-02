import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { CustomerRoutes } from './customer.routing';
import { CustomerTableComponent } from './customersearch/customer-table.component';
import { AngularMaterialModule } from 'src/app/angular-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterCustomers } from 'src/app/core/pipe/searchfilter.pipe';

import { ApprovePayeeComponent } from '../payee/approve-payee.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewPayeeComponent } from './payeesearch/view-payee.component';
import { SearchCustomerPipe } from 'src/app/core/pipe/searchfilter.pipe';
import { FilterCustomerNumber } from 'src/app/core/pipe/searchfilter.pipe';
import {MatSortModule} from '@angular/material/sort';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
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
    FilterCustomers,
    CustomerTableComponent,
    ApprovePayeeComponent,
    ViewPayeeComponent,
    SearchCustomerPipe,
    FilterCustomerNumber
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(CustomerRoutes),
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatSortModule
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ]
})
export class CustomerModule { }
