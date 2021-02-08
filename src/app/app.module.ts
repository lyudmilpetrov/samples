import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TasksService } from '@app/signalr-core/tasks.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { MainNavComponent } from './main-nav/main-nav.component';
import { ChartJSComponent } from './chart-js/chart-js.component';
import { CardComponent } from './chart-js/components/card/card.component';
import { LineChartComponent } from './chart-js/components/line-chart/line-chart.component';
import { BarChartComponent } from './chart-js/components/bar-chart/bar-chart.component';
import { SliderComponent } from './chart-js/components/slider/slider.component';
import { RadarChartComponent } from './chart-js/components/radar-chart/radar-chart.component';
import { Globals } from './shared/globals';
import { ApiServices, OfflineService } from './services/services';
import { OverlayModule } from '@angular/cdk/overlay';
// import { ToastrService } from '@app/services/toastr.service';
import { Toastr, TOASTR_TOKEN } from '@app/services/toastr.service';
import * as toastr from 'toastr';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ProgressInfoModule } from '@app/components/progress-info/progress-info.module';
import { FlexLayoutModule } from '@angular/flex-layout';
// const toastr = window['toastr'];

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    FlexLayoutModule,
    HttpClientModule,
    OverlayModule,
    ProgressInfoModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'Building-App-Xsrf-Cookie',
      headerName: 'Building-App-Xsrf-Header'
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  declarations: [
    AppComponent,
    MainNavComponent,
    ChartJSComponent,
    CardComponent,
    LineChartComponent,
    BarChartComponent,
    RadarChartComponent,
    SliderComponent
  ],
  providers: [Globals, TasksService, OfflineService, ApiServices,
    //  ToastrService
    { provide: TOASTR_TOKEN, useValue: toastr }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule { }
