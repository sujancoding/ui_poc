import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentMaintenanceRoutingModule } from './agentmaintenance.routing';

import { AngularMaterialModule } from 'src/app/angular-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { ParentStepperComponent } from './modals/parentstepper/parent-stepper.component';
import { AgentProfilesComponent } from './modals/agentprofiles/agent-profiles.component';
import { AgentAssociatesComponent } from './modals/agentassociates/agent-associates.component';
import { AgentDocumentsComponent } from './modals/agentdocuments/agent-documents.component';
import { AgentListingsComponent } from './agentlistings/agent-listings.component';
import { MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { RegisterAgentComponent } from './modals/resigteragent/register-agent.component';
import { AdminConfirmationDialogComponent } from './modals/adminconfirmationdialog/admin-confirmation-dialog.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AgentMarginTierUpdateComponent } from './modals/agent-margin-tier-update/agent-margin-tier-update.component';

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
    ParentStepperComponent,
    AgentProfilesComponent,
    AgentAssociatesComponent,
    AgentDocumentsComponent,
    AgentListingsComponent,
    RegisterAgentComponent,
    AdminConfirmationDialogComponent,
    AgentMarginTierUpdateComponent,
  ],
  imports: [
    CommonModule,
    AgentMaintenanceRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    SharedModule,
    MatStepperModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports:[MatStepperModule],

  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    
    ]
})
export class AgentMaintenanceModule { }
