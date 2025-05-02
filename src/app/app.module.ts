import { BrowserModule } from '@angular/platform-browser'
import { NgModule, } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { AppComponent } from './app.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FullComponent } from './shared/layouts/full/full.component';
import { AppBlankComponent } from './shared/layouts/blank/blank.component';

import { VerticalAppHeaderComponent } from './shared/layouts/full/vertical-header/vertical-header.component';
import { VerticalAppSidebarComponent } from './shared/layouts/full/vertical-sidebar/vertical-sidebar.component';
import { HorizontalAppHeaderComponent } from './shared/layouts/full/horizontal-header/horizontal-header.component';
import { HorizontalAppSidebarComponent } from './shared/layouts/full/horizontal-sidebar/horizontal-sidebar.component';
import { InventoryVerticalSidebarComponent } from './shared/layouts/full/inventory-vertical-sidebar/inventory-vertical-sidebar.component';
import { AppBreadcrumbComponent } from './shared/layouts/full/breadcrumb/breadcrumb.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material-module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AuthHeadearInterceptor } from './shared/services/authheader.interceptor';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { TitleHeaderService } from './core/services/headertitle.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { OrganizationMarketingComponent } from './marketing/organization/organization-marketing.component';

import {
  SessionExpirationAlert,
  SessionInterruptService,
} from './shared/session-timeout/public.api';

import { AppSessionInterruptService } from './shared/services/app-session-interrupt.service';
import { SwUpdateService} from './shared/services/swlog.service';
import { OrganizationContentComponent } from './marketing/organization-content/organization-content/organization-content.component';
import { AppRoutingModule } from './app.routing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export function HttpLoaderFactory(http: HttpClient): any {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
};

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    VerticalAppHeaderComponent,
    SpinnerComponent,
    AppBlankComponent,
    VerticalAppSidebarComponent,
    AppBreadcrumbComponent,
    HorizontalAppHeaderComponent,
    HorizontalAppSidebarComponent,
    OrganizationMarketingComponent,
    OrganizationContentComponent,
    InventoryVerticalSidebarComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    PerfectScrollbarModule,
    AppRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
   // RouterModule.forRoot(AppRoutes, { relativeLinkResolution: 'legacy', enableTracing: false }),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatSnackBarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 5 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:5000'
    }),
    SessionExpirationAlert.forRoot({ totalMinutes: 5 }),


  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeadearInterceptor,
      multi: true
    }
    , TitleHeaderService,
    {
      provide: SessionInterruptService,
      useClass: AppSessionInterruptService,
    },
    SwUpdateService
  ],
  bootstrap: [AppComponent],


})
export class AppModule { }
