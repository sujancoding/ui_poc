import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionMcRoutingModule, transactionMcRoutes } from './transaction-mc-routing.module';
import { ViewTransactionMcComponent } from './viewtransaction/view-transaction-mc.component';
import { RouterModule } from '@angular/router';
import { AddTransactionComponent } from './addtransaction/add-transaction.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularMaterialModule } from 'src/app/angular-material-module';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MoneyChangerModule } from '../moneychanger.module';
import { DataHistoryConfirmationDialogComponent } from './modals/datahistoryconfirmationdialog/data-history-confirmation-dialog.component';


import { UserMessageComponent } from './modals/user-message/user-message/user-message.component';
import { ParentDealSelectionTabComponent } from './modals/parent-deal-selection-tab/parent-deal-selection-tab.component';
import { DealsComponent } from './modals/deals/deals.component';
import { ShipmentDealsComponent } from './modals/shipment-deals/shipment-deals.component';
import { ReprintTransactionComponent } from './modals/reprint-transaction/reprint-transaction.component' ;

//import{NgxPrintModule} from 'ngx-print';
import { TruncateTextPipe } from 'src/app/core/pipe/truncate-text.pipe';

@NgModule({
  declarations: [
    ViewTransactionMcComponent,
    AddTransactionComponent,
    DataHistoryConfirmationDialogComponent,
    UserMessageComponent,
    ParentDealSelectionTabComponent,
    DealsComponent,
    ShipmentDealsComponent,
    ReprintTransactionComponent,
    TruncateTextPipe
  
  ],
  imports: [
    CommonModule,
    SharedModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(transactionMcRoutes),
    MoneyChangerModule,
  //  NgxPrintModule
 
  ],
  exports : [
    AddTransactionComponent
  ],
  providers :[
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef,  useValue: {}}
  ]
})
export class TransactionMcModule { }
