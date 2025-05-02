
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { privacyRoutes } from './privacy-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { NgxPaginationModule } from 'ngx-pagination';
import { PrivacyPolicyContentComponent } from './privacy-policy-content/privacy-policy-content.component';



@NgModule({
  declarations: [
    PrivacyPolicyContentComponent
  ],

  imports: [
    CommonModule,
    RouterModule.forChild(privacyRoutes),
    NgxPaginationModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule, ReactiveFormsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    SharedModule,
    MatIconModule
  ],
 
  providers: [

    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {}}
  ]
})
export class PrivacyModule { }

