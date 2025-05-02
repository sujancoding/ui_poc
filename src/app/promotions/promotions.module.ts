import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionsComponent } from './promotions/promotions.component';
import { RouterModule } from '@angular/router';
import { PromotionsRoutes } from './promotions.routing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AngularMaterialModule } from '../angular-material-module';
import {NgxPaginationModule} from 'ngx-pagination';
import { AddPromotionComponent } from './add-promotion/add-promotion.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { filterdescription } from '../core/pipe/searchfilter.pipe';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';




@NgModule({
  declarations: [
    PromotionsComponent,
    AddPromotionComponent,
    filterdescription
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PromotionsRoutes),
    MatFormFieldModule,
    AngularMaterialModule,
    NgxPaginationModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule, 
    MatNativeDateModule 
  ],
})
export class PromotionsModule { }
