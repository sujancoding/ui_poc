import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material-module';

import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '../shared/shared.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";


import { moneyChangerRoutes } from './moneychanger.routing';
import { MoneyChangerDashboardComponent } from './dashboards/money-changer-dashboard.component';
import { ParentStepperOnboardingComponent } from './modals/mc-onboarding/onboardingparentstepper/parent-stepper-onboarding.component';
import { RegistrationComponent } from './modals/registration/registration.component';
import { ProfileModule } from '../onboarding/onboarding.module';
import { MatStepperModule } from '@angular/material/stepper';
import { CurrencyStockComponent } from './modals/currencystock/currency-stock.component';
import { CorporateRegistrationComponent } from './modals/corporateregistration/corporate-registration.component';
import { CompanyModule } from '../onboarding/corporate/profile/company.module';
import { DocumentsIndividualMcComponent } from './modals/mc-onboarding/documentsindividual/documents-individual-mc.component';
import { DocumentsCorporateMcComponent } from './modals/mc-onboarding/documentscorporate/documents-corporate-mc.component';
import { ApplicationSubmitDialogComponent } from './modals/mc-onboarding/mc-application-submit-dialog/application-submit-dialog.component';
import { EditDealMcComponent } from './modals/editdeal/edit-deal-mc.component';
import { NoteDialogComponent } from './modals/note-dialog/note-dialog.component';




@NgModule({
  declarations: [
    MoneyChangerDashboardComponent,
    ParentStepperOnboardingComponent,
    RegistrationComponent,
    CurrencyStockComponent,
    CorporateRegistrationComponent,
    DocumentsIndividualMcComponent,
    DocumentsCorporateMcComponent,
    ApplicationSubmitDialogComponent,
    EditDealMcComponent,
    NoteDialogComponent,
   
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(moneyChangerRoutes),
    MatFormFieldModule,
    MatInputModule,
    FormsModule, ReactiveFormsModule,
    AngularMaterialModule ,
    FlexLayoutModule,
    SharedModule,
    MatIconModule,
    ProfileModule, // --> Profile (onboarding) module was impprted here because we are reusing components inside profile module for money changer module .
    CompanyModule  // --> Company (onboarding) module was impprted here because we are reusing components inside company module for money changer module .
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports:[MatStepperModule, CurrencyStockComponent],

  providers: [

    { provide: MAT_DIALOG_DATA, useValue: {} },
    {
      provide: MatDialogRef,  useValue: {}
    }
  ]
})
export class MoneyChangerModule { }