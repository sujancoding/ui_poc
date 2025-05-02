import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MatOptionModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AngularMaterialModule } from '../angular-material-module';
import { MatSelectModule } from '@angular/material/select';
import {NgxPaginationModule} from 'ngx-pagination';
import { AgentSettlementComponent } from './settlement/agent-settlement.component';

import { AgentRoutes } from './agent-routing.module';

import { AgentRemittanceComponent } from './remittance/parent-tab/agent-remittance.component';
import { PayeeComponent } from '../payee/payee-table/payee.component';
import { OrganizationInitiatedComponent } from './remittance/organization-initiated/organization-initiated.component';
import { AgentDealComponent } from './deal/agent-deal.component';
import { AgentSendmoneyComponent } from './agent-sendmoney/agent-sendmoney.component';
import { SearchAgentFilter } from '../core/pipe/searchfilter.pipe';
import { AgentServiceService } from './agent-service.service';
import { AgentInitiatedComponent } from './remittance/agent-initiated/agent-initiated.component';
import { AcknowledgeTransactionComponent } from './modals/acknowledge-transaction/acknowledge-transaction.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookContractComponent } from './bookcontract/book-contract.component';
import { AgentContractConfirmationComponent } from './modals/contract-confirmation/agent-contract-confirmation.component';
import { AgentViewContractsComponent } from './viewcontracts/agent-view-contracts.component';
import { TenorDatesComponent } from './modals/tenortype/tenor-dates.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NumbersOnlyDirective } from '../shared/accordion/numbersonly.directive';
import { AgentReceiptComponent } from './modals/transfer-receipt/agent-receipt.component';
import { UserConfirmationDialogComponent } from './modals/user-confirmation-dialog/user-confirmation-dialog.component';

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
    AgentRemittanceComponent,
    PayeeComponent,
    OrganizationInitiatedComponent,
    AgentDealComponent,
    AgentSettlementComponent,
    AgentSendmoneyComponent,
    SearchAgentFilter,
    AgentInitiatedComponent,
    AcknowledgeTransactionComponent,
    BookContractComponent,
    AgentContractConfirmationComponent,
    AgentViewContractsComponent,
    TenorDatesComponent,
    NumbersOnlyDirective,
    AgentReceiptComponent,
    UserConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AgentRoutes),
    MatIconModule,
    MatCardModule,
    MatInputModule,
    SharedModule,
    FormsModule, ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    AngularMaterialModule,
    NgxPaginationModule
  ],
  providers:[
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    AgentServiceService,{provide: MatDialogRef, useValue: {}},
    { provide: MAT_DIALOG_DATA, useValue: {}}]
})
export class AgentModule { }
