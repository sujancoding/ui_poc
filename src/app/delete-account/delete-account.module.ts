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


import { deleteAccountRoutes } from 'src/app/delete-account/delete-account-routing.module'
import { DeleteAccountComponent } from './delete-account/delete-account.component';





@NgModule({
  declarations: [
    DeleteAccountComponent
   
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(deleteAccountRoutes),
    MatFormFieldModule,
    MatInputModule,
    FormsModule, ReactiveFormsModule,
    AngularMaterialModule ,
    FlexLayoutModule,
    SharedModule,
    MatIconModule,
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
export class DeleteAccountModule { }
