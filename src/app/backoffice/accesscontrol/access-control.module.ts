import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccessControlRoutingModule } from './access-control-routing.module';
import { RoleMaintenanceComponent } from './role-maintenance/role-maintenance.component';

import { AngularMaterialModule } from '../../angular-material-module';
import { MatPaginatorModule } from '@angular/material/paginator';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddRoleComponent } from './modals/addrole/add-role.component';
import { SharedModule } from '../../shared/shared.module';
import { BackofficeUsersComponent } from './users/backoffice-users.component';
import { PipsMaintenanceComponent } from './pips-maintenance/pips-maintenance.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DayEndComponent } from './day-end/day-end.component';
import { DayEndConfirmationDialogComponent } from './modals/day-end-confirmation-dialog/day-end-confirmation-dialog.component';

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
    RoleMaintenanceComponent,
    AddRoleComponent,
    BackofficeUsersComponent,
    PipsMaintenanceComponent,
    DayEndComponent,
    DayEndConfirmationDialogComponent
    
  ],
  imports: [
    CommonModule,
    AccessControlRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedModule,
    MatPaginatorModule
    

  ]
  ,
  providers :[
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ]
})
export class AccessControlModule { }
