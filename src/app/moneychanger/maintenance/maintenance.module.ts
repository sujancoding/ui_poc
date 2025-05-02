import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { CurrencyComponent } from './currency/currency.component';
import { CounterComponent } from './counter/counter.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularMaterialModule } from 'src/app/angular-material-module';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateCounterComponent } from './modals/update-counter/update-counter.component';
import { UpdateCurrencyComponent } from './modals/update-currency/update-currency.component';
import { CounterTypeTransformPipe } from 'src/app/core/pipe/searchfilter.pipe';
import { MAT_DIALOG_DATA , MatDialogRef} from '@angular/material/dialog';
import { UpdateCurrencyValueComponent } from './modals/update-currency-value/update-currency-value.component';


@NgModule({
  declarations: [
    CurrencyComponent,
    CounterComponent,
    UpdateCounterComponent,
    UpdateCurrencyComponent,
    CounterTypeTransformPipe,
    UpdateCurrencyValueComponent
  ],
  imports: [
    CommonModule,
    MaintenanceRoutingModule,
    SharedModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ],

  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} }, // You can use an empty object or provide data if needed
    { provide: MatDialogRef,  useValue: {} }
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]

})
export class MaintenanceModule { }
