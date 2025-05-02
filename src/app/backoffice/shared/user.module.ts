import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
//import { DaysetupComponent } from './daysetup/daysetup.component';
import { AdminRoutes } from './user.routing';
import { RouterModule } from '@angular/router';
import { AgentTableComponent } from '../remittance/unpostedtransaction/agents/agent-transactions.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { AngularMaterialModule } from '../../angular-material-module';
import { TransactionComponent } from '../remittance/unpostedtransaction/customers/transaction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

//import { TransactionProgressComponent } from './all-transactions/transaction-progress/transaction-progress.component';
//import { FilterSearchComponent } from './filter-search/filter-search.component';
import { SharedModule } from '../../shared/shared.module';


import { UnpostedTransactionComponent } from '../remittance/unpostedtransaction/modals/unposted-transaction.component';
import { SendMoneyComponent } from '../remittance/sendmoney/send-money.component';
import { PostedTransactionComponent } from '../remittance/postedtransaction/posted-transaction.component';
import { BranchuserDashboardComponent } from '../dashboards/branchuser-dashboard.component';
import { ExchangeRateComponent } from '../exchangerates/exchange-rate.component';
import { ApprovedProspect } from './modals/confirmation-dialog.component';
import { SearchCustomerNamePipe } from 'src/app/core/pipe/searchfilter.pipe';
import { AddCountrycodeComponent } from './modals/addcountrycode/add-countrycode.component';
import { ErrorDialogAdminComponent } from './modals/errordialogadmin/error-dialog-admin.component';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { OrganisationSettlementComponent } from '../remittance/orgsettlement/organisation-settlement.component';
import { CalculatorComponent } from '../calculator/calculator.component';
import { SearchUnPostedCustomerPipe } from 'src/app/core/pipe/searchfilter.pipe';
import { ReviewDetailsBackofficeComponent } from '../remittance/reviewdetails/review-details-backoffice.component';
import { SuccessReceiptAdminComponent } from '../remittance/successreceipt/success-receipt-admin.component';
import { ParentCalculatorComponent } from '../calculator-mat-tabs/parent-calculator/parent-calculator.component';
import { MultiDealCalciComponent } from '../calculator-mat-tabs/parent-calculator/multi-deals/multi-deal-calci/multi-deal-calci.component';
import { CorporateConfirmationDialogComponent } from './modals/corporateconfirmationdialog/corporate-confirmation-dialog.component';
import { AgentSendmoneyCalculatorComponent } from '../calculator-mat-tabs/parent-calculator/agent-sendmoney-calculator/agent-sendmoney-calculator.component';
import { ViewAgentComponent } from './modals/viewagent/view-agent/view-agent.component';
import { CorporateExchangerateComponent } from '../exchangerates/corporate-tab/corporate-exchangerate.component';
import { CorporateExchangeratesComponent } from './modals/addcorporatecustomers/corporate-exchangerates.component';
import { OnlineReportsComponent, TransactionReportKeysPipe } from '../onlinereports/transactionreports/online-reports.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ReportsTypeComponent } from '../onlinereports/reportstype/reports-type.component';
import { KeysPipe } from '../onlinereports/reportstype/reports-type.component';
import { AddUserComponent } from './modals/adduser/add-user.component';
import { AlertDialogComponent } from './modals/alertdialogbox/alert-dialog.component';
import { BackofficeNumbersOnlyDirective } from './directives/usernumberonly.directive';
import { TwoDigitDecimaNumberDirective } from 'src/app/shared/accordion/twodecimalplaces.directive';
import { ViewDepositSlipComponent } from './modals/viewdepositslip/view-deposit-slip.component';
import { OrganizationAccountsHistoryComponent } from '../remittance/orgaccountshistory/organization-accounts-history.component';
import { AgentAccountsHistoryComponent } from '../remittance/agentaccountshistory/agent-accounts-history.component';
import { ViewTransactionAckDetailsComponent } from './modals/viewtransactionack/view-transaction-ack-details.component';
import { OrganisationAssetAccountSettlementComponent } from './modals/organisation-asset-account-settlement/organisation-asset-account-settlement.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewCustomerstatusRemarksComponent } from './modals/view-customerstatus-remarks/view-customerstatus-remarks.component';
import { UpdateCustomerAccountsComponent } from './modals/update-customer-accounts/update-customer-accounts.component';
import { ViewManagementReportConfirmationDialogComponent } from './modals/view-management-report-confirmation-dialog/view-management-report-confirmation-dialog.component';
import { UpdateTransactionStatusComponent } from './modals/update-transaction-status/update-transaction-status.component';
import { OrganisationExpensesAddComponent } from './modals/organisation-expenses-add/organisation-expenses-add.component';
import { OrganisationResetAccountBalanceComponent } from './modals/organisation-reset-account-balance/organisation-reset-account-balance.component';
import { ExpensesTransactionHistoryComponent } from '../remittance/expenses-transaction-history/expenses-transaction-history.component';
import { ResetAccountsHistoryComponent } from '../remittance/reset-accounts-history/reset-accounts-history.component';
import { TransactionSummaryReportComponent } from '../onlinereports/transaction-summary-report/transaction-summary-report.component';
import { TransactionSuspiciousRemarksComponent } from '../remittance/unpostedtransaction/modals/transaction-suspicious-remarks/transaction-suspicious-remarks.component';
import { OrganisationFundTransferComponent } from './modals/organisation-fund-transfer/organisation-fund-transfer.component';
import { RtKycConfigComponent } from '../onlinereports/rt-kyc-config/rt-kyc-config.component';
import { RtAddKycConfigComponent } from './modals/rt-add-kyc-config/rt-add-kyc-config.component';


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
    AgentTableComponent,
    TransactionComponent,
    UnpostedTransactionComponent,
    SendMoneyComponent,
    PostedTransactionComponent,
    BranchuserDashboardComponent,
    ExchangeRateComponent,
    OrganisationSettlementComponent,
    CalculatorComponent,
    ReviewDetailsBackofficeComponent,
    SuccessReceiptAdminComponent,
    ParentCalculatorComponent,
    CorporateExchangerateComponent,
    MultiDealCalciComponent,
    ApprovedProspect,SearchCustomerNamePipe,
    SearchUnPostedCustomerPipe,
    AgentSendmoneyCalculatorComponent,
    OnlineReportsComponent,
    ReportsTypeComponent,
    KeysPipe,
    TransactionReportKeysPipe,
    BackofficeNumbersOnlyDirective,
    TwoDigitDecimaNumberDirective,
   AddCountrycodeComponent, ErrorDialogAdminComponent, CorporateConfirmationDialogComponent, ViewAgentComponent, CorporateExchangeratesComponent, AddUserComponent, AlertDialogComponent, ViewDepositSlipComponent,
   OrganizationAccountsHistoryComponent,
   AgentAccountsHistoryComponent,
   ViewTransactionAckDetailsComponent,
   OrganisationAssetAccountSettlementComponent,
   ViewCustomerstatusRemarksComponent,
   UpdateCustomerAccountsComponent,
   ViewManagementReportConfirmationDialogComponent,
   UpdateTransactionStatusComponent,
   OrganisationExpensesAddComponent,
   OrganisationResetAccountBalanceComponent,
   ExpensesTransactionHistoryComponent,
   ResetAccountsHistoryComponent,
   TransactionSummaryReportComponent,
   TransactionSuspiciousRemarksComponent,
   OrganisationFundTransferComponent,
   RtKycConfigComponent,
   RtAddKycConfigComponent
    
    
    
   // DaysetupComponent
  ],
  
  imports: [
    CommonModule,
    RouterModule.forChild(AdminRoutes),
    NgxPaginationModule,
    AngularMaterialModule,
    SharedModule,
    FormsModule, ReactiveFormsModule,
    FlexLayoutModule,
    //PayeeModule
  ],
 
 
 providers : [
  { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
 ]

})
export class AdminModule { }
