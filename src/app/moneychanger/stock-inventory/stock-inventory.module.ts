import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/angular-material-module';

import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { StockInventoryRoutingModule } from './stock-inventory-routing.module';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryHistoryComponent } from './inventory-history/inventory-history.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE  } from '@angular/material/core';

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
    InventoryComponent,
    InventoryHistoryComponent
  ],
  imports: [
    CommonModule,
    StockInventoryRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    SharedModule
  ],

  providers :[
    { provide: MAT_DIALOG_DATA, useValue: {} },
    {provide: MatDialogRef,  useValue: {}},
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class StockInventoryModule { }
