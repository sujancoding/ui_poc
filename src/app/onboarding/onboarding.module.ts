import { NgModule,   CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CommonModule } from '@angular/common';
import { PersonalInfoComponent } from './individual/basic-info/basic-info.component';
import { AddressComponent } from './individual/sow/sourceofwealth.component';
import { RouterModule } from '@angular/router';
import { ProfileRoutes } from './onboarding.routing.module';
import { IdentitydocumentComponent } from './individual/documents/document-uploader.component';


import {NgxPaginationModule} from 'ngx-pagination';

import { AngularMaterialModule } from '../angular-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { MatOptionModule ,DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE  } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { SharedModule } from '../shared/shared.module';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';


import { MatIconModule } from "@angular/material/icon";
import { DesktopBranchComponent } from '../backoffice/onboarding/applicationsearch/applicationsearch.component';
import { IndividualComponent } from './modals/progress-report.component';
import { ProfileEvaluatingComponent } from './modals/profile-evaluator-alert.component';
import {SwiperModule} from 'swiper/angular';


import { SearchfilterPipe } from '../core/pipe/searchfilter.pipe';
import { FilterNumber } from '../core/pipe/searchfilter.pipe';
import { FilterApplicationType } from '../core/pipe/searchfilter.pipe';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../backoffice/shared/modals/confirmation-dialog.component';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ErrorDialogComponent } from './modals/errordialog.component';
import { CorporateDashboardComponent } from './corporate/dashboard/corporate-dashboard.component';
import { CorporateProgressReportComponent } from './modals/corporate-progressreport/corporate-progress-report.component';
import { PdfPreviewComponent } from './individual/pdfpreview/pdf-preview/pdf-preview.component';
import { PreviewDocumentComponent } from '../backoffice/preview-document/preview-document/preview-document.component';
import { QrCorporateComponent } from './corporate/qr/qr-corporate.component';


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
    PersonalInfoComponent,
    AddressComponent,
    IdentitydocumentComponent,
    ErrorDialogComponent,
    CorporateDashboardComponent,
    CorporateProgressReportComponent,
    PdfPreviewComponent,
    PreviewDocumentComponent,
    QrCorporateComponent,
    DesktopBranchComponent,
    IndividualComponent,
    ProfileEvaluatingComponent,
    SearchfilterPipe,
    FilterNumber,
    FilterApplicationType,
    ConfirmationDialogComponent,
        


  ],
  exports: [ PersonalInfoComponent,
    AddressComponent,
    IdentitydocumentComponent,],
  imports: [
    CommonModule,
    RouterModule.forChild(ProfileRoutes),
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatRadioModule,
    HttpClientModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    SwiperModule,
    MatDatepickerModule,
    MatNativeDateModule, MatToolbarModule,
    SharedModule,
    MatIconModule,
    MatDialogModule,
    NgxPaginationModule
  

  ],

  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],

  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: MatBottomSheetRef, useValue: {} },
    { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} }
  ]

})
export class ProfileModule { }
