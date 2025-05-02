import { NgModule} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardsRoutes } from './dashboards.routing';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';




import { CustomerdashboardComponent } from './customerdashboard/customerdashboard.component';
import { EmployeedashboardComponent } from './employeedashboard/employeedashboard.component';
import { AppCustomerActivityComponent } from './dashboard-components/app-customer-activity/app-customer-activity.component';
import { AppCustomerQuickComponent } from './dashboard-components/app-customer-quick/app-customer-quick.component';
import { AppCustomerMessagesComponent } from './dashboard-components/app-customer-messages/app-customer-messages.component';
import {MatTabsModule} from '@angular/material/tabs';

import {SwiperModule} from 'swiper/angular';

import { AgentDashboardComponent } from '../agent/dashboard/agent-dashboard.component';
import SwiperCore, { FreeMode, Pagination } from "swiper";
import { MatBottomSheet, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';



SwiperCore.use([FreeMode, Pagination]);

@NgModule({
    imports: [
        CommonModule,
        AngularMaterialModule,
        FlexLayoutModule,
        ChartistModule,
        ChartsModule,
        NgApexchartsModule,
        RouterModule.forChild(DashboardsRoutes),
        FormsModule,
        ReactiveFormsModule,
        SwiperModule,
        MatTabsModule,
        SharedModule,
        HttpClientModule
    ],
    declarations: [
        CustomerdashboardComponent,
        EmployeedashboardComponent,
        AppCustomerActivityComponent,
        AppCustomerQuickComponent,
        AppCustomerMessagesComponent,
        AgentDashboardComponent
    ],
    providers: [
        { provide: MatBottomSheet },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
    ]
})
export class DashboardsModule { }
