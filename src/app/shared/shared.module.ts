import { NgModule } from '@angular/core';
import { MenuItems } from './menu-items/menu-items';
import { HorizontalMenuItems } from './menu-items/horizontal-menu-items';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective  } from './accordion';
import { CommaSeparatedInputDirective } from './accordion/commaseparatedinput.directive';
import { AlertComponent } from './components/alert.component';
import { CommonModule } from '@angular/common';
import { LabelPipe } from './pipe/label.pipe';
import { PayeeDetailsComponent } from './components/payee-details/payee-details.component';
import { AngularMaterialModule } from '../angular-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReviseExchangeComponent } from './components/revise-exchange/revise-exchange.component';
import { AgentCardComponent } from './components/agent-card/agent-card.component';
import { TotalAmountComponent } from './components/total-amount/total-amount.component';
import { SuccessDialogComponent } from './components/success-dialog/success-dialog.component';
import { ApproveDetailsComponent } from './components/approve-details/approve-details.component';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { AgentDetailsComponent } from './components/agent-details/agent-details.component';
import { ExchangeRateForward , ExchangeRateReverse } from './pipe/exchangerate-pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import { ReviewRemittanceComponent } from './components/review/review-remittance.component';
import { RouterModule } from '@angular/router';
import { sharedRoutes } from './shared.routing';
import { ReceiptComponent } from './components/successreceipt/receipt.component';
import { CancelDialogComponent } from './modals/cancel-dialog.component';
import { LogoutConfirmationDialogComponent } from './modals/logoutconfirmationdialog/logout-confirmation-dialog/logout-confirmation-dialog.component';
import { TokenExpiredDialogComponent } from './modals/tokenexpireddialog/token-expired-dialog.component';
import { AlertInfoComponent } from './modals/alert-info/alert-info.component';
import { CancelTransactionComponent } from './modals/canceltransaction/cancel-transaction.component';
import { CommaSeparatedRateInputDirective } from './accordion/commaseparatedrateinput.directive';
import { ForceLogoutComponent } from './modals/force-logout/force-logout.component';
import { AppendZeroDirective } from './accordion/appendzero.directive';





@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    RouterModule.forChild(sharedRoutes),
  ],
  declarations: [AccordionAnchorDirective,CommaSeparatedInputDirective,CommaSeparatedRateInputDirective, LabelPipe, AccordionLinkDirective, AccordionDirective, AlertComponent, PayeeDetailsComponent, ReviseExchangeComponent, AgentCardComponent, TotalAmountComponent, SuccessDialogComponent, ApproveDetailsComponent, AgentDetailsComponent
  ,ExchangeRateForward , ExchangeRateReverse, ReviewRemittanceComponent, ReceiptComponent, CancelDialogComponent, LogoutConfirmationDialogComponent, TokenExpiredDialogComponent, AlertInfoComponent, CancelTransactionComponent, ForceLogoutComponent, AppendZeroDirective],
  exports: [AccordionAnchorDirective, LabelPipe, AccordionLinkDirective, AccordionDirective, AlertComponent, AlertInfoComponent,PayeeDetailsComponent,ReviseExchangeComponent,AgentCardComponent,TotalAmountComponent,ApproveDetailsComponent,AgentDetailsComponent,
    ExchangeRateForward , ExchangeRateReverse,CommaSeparatedInputDirective, CommaSeparatedRateInputDirective, AppendZeroDirective],
  providers: [MenuItems, HorizontalMenuItems],


})
export class SharedModule { }
