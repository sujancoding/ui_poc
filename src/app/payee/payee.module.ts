import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayeeComponent } from './payee/payee.component';
import { RouterModule } from '@angular/router';
import { PayeeRoutes } from './payee.routing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material-module';
import { ReceiptComponent } from './receipt/receipt.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PayeeAddedComponent } from './payee-added/payee-added.component';
import { AddPayeeComponent } from './add-payee/add-payee.component';
import { RemitMoneyComponent } from './remit-money/remit-money.component';
import { AllPayeeComponent } from './all-payee/all-payee.component';
import { AllTransactionsComponent } from './all-transactions/all-transactions.component';
import { ExchangeRatePipe , ReverseExchangeRatePipe } from './payee-pipe/multiply.pipe';
import { SharedModule } from '../shared/shared.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { ReviewDetailsComponent } from './reviewdetails/review-details.component';
import { QrCodeComponent } from './qrcode/qr-code.component';
import { SearchPayeePipe } from '../core/pipe/searchfilter.pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import { CorporateDealSendMoneyComponent } from './corporate-deal-send-money/corporate-deal-send-money.component';
import { CorporateDealReviewTransactionComponent } from './corporate-deal-review-transaction/corporate-deal-review-transaction.component';
import { CorporateDealQrComponent } from './corporate-deal-qr/corporate-deal-qr.component';
import { CorporateDealTransactionReceiptComponent } from './corporate-deal-transaction-receipt/corporate-deal-transaction-receipt.component';




@NgModule({
  declarations: [
    PayeeComponent,
    ReceiptComponent,
    PayeeAddedComponent,
    AddPayeeComponent,
    RemitMoneyComponent,
    AllPayeeComponent,
    AllTransactionsComponent,
    SearchPayeePipe,
    ExchangeRatePipe, ReverseExchangeRatePipe, ReviewDetailsComponent, QrCodeComponent, CorporateDealSendMoneyComponent, CorporateDealReviewTransactionComponent, CorporateDealQrComponent, CorporateDealTransactionReceiptComponent
   
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PayeeRoutes),
    NgxPaginationModule ,
    MatFormFieldModule,
    MatInputModule,
    FormsModule, ReactiveFormsModule,
    AngularMaterialModule ,
    FlexLayoutModule,
    SharedModule,
    MatIconModule
  ],
  exports:[ExchangeRatePipe, ReverseExchangeRatePipe],
 // entryComponents: [ExchangeRatePipe.rootComponent , ReverseExchangeRatePipe.rootComponent],
  providers: [

    { provide: MAT_DIALOG_DATA, useValue: {} },
    {
      provide: MatDialogRef,  useValue: {}
    }
  ]
})
export class PayeeModule { }
