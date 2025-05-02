import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DateAdapter, MatNativeDateModule, MatOptionModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule } from "@angular/router";
import { AngularMaterialModule } from "src/app/angular-material-module";
import { SharedModule } from "src/app/shared/shared.module";
import { CompanyProfileComponent } from "./company-profile.component";
import { CompanyProfileRoutes } from "./company.routing";
import { CompanyAssociateComponent } from "../sow/company.associate.component";
import { CompanyDocumentsComponent } from "../documents/company-documents.component";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";


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
     
        CompanyProfileComponent,
        CompanyAssociateComponent,
        CompanyDocumentsComponent
    
    ],
    exports: [CompanyProfileComponent, CompanyAssociateComponent,CompanyDocumentsComponent ],
    imports: [
      CommonModule,
      RouterModule.forChild(CompanyProfileRoutes),
      AngularMaterialModule,
      FlexLayoutModule,
      FormsModule, ReactiveFormsModule,
      MatFormFieldModule,
      MatRadioModule,
      HttpClientModule,
      MatOptionModule,
      MatSelectModule,
      MatInputModule,
      MatDatepickerModule,
      MatNativeDateModule, MatToolbarModule,
      SharedModule,
     
  
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
    ],
    
    providers:[
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }]
  })
  export class CompanyModule { }
  