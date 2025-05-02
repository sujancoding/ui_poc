import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from 'src/app/angular-material-module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module';

import { ShipmentRoutingModule } from './shipment-routing.module';
import { AddShipmentComponent } from './add-shipment/add-shipment.component';
import { SearchShipmentComponent } from './search-shipment/search-shipment.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AddBagComponent } from './modals/add-bag/add-bag.component';
import { InvoiceConfirmationComponent } from './modals/invoice-confirmation/invoice-confirmation.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CaptureDenominationComponent } from './modals/capture-denomination/capture-denomination.component';

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
    AddShipmentComponent,
    SearchShipmentComponent,
    AddBagComponent,
    InvoiceConfirmationComponent,
    CaptureDenominationComponent
  ],
  imports: [
    CommonModule,
    ShipmentRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef,  useValue: {}}
  ]
})
export class ShipmentModule { }
