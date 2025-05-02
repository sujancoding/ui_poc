
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/angular-material-module';

import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";


import { popupWindowRoutes } from './shortcuts-window-routing.module' ;

import { InventoryWindowComponent } from './inventory-window/inventory-window.component';
import { AddTransactionWindowComponent } from './add-transaction-window/add-transaction-window.component';
import { TransactionMcModule } from '../transaction/transaction-mc.module';
import { DisplayRatesWindowComponent } from './display-rates-window/display-rates-window.component';
import { AddDealWindowComponent } from './add-deal-window/add-deal-window.component';
import { DealsMcModule } from '../deals/dealsmc.module';
import { DealListingWindowComponent } from './deal-listing-window/deal-listing-window.component';
import { CustomerAccountsWindowComponent } from './customer-accounts-window/customer-accounts-window.component';
import { AccountsMoneyChangerModule } from '../accounts-money-changer/accounts-money-changer.module';


@NgModule({
  declarations: [
    InventoryWindowComponent,
    AddTransactionWindowComponent,
    DisplayRatesWindowComponent,
    AddDealWindowComponent,
    DealListingWindowComponent,
    CustomerAccountsWindowComponent
  ],
  imports: [
    CommonModule,
    CommonModule,
    RouterModule.forChild(popupWindowRoutes),
    MatFormFieldModule,
    MatInputModule,
    FormsModule, ReactiveFormsModule,
    AngularMaterialModule ,
    FlexLayoutModule,
    SharedModule,
    MatIconModule,
    TransactionMcModule,
    DealsMcModule,
    AccountsMoneyChangerModule
  ],
  
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],

  providers: [

    { provide: MAT_DIALOG_DATA, useValue: {} },
    {
      provide: MatDialogRef,  useValue: {}
    }
  ]

})
export class ShortcutsWindowModule { }
