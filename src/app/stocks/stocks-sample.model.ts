import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StocksSampleRoutes } from './stocks-sample.routes';
import { StocksSampleComponent } from './stocks-sample.component';
import { MaterialModule } from '../shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
  imports: [
    RouterModule.forChild(StocksSampleRoutes),
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MaterialModule,
    FlexLayoutModule
  ],
  declarations: [
    StocksSampleComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class StocksSampleModule { }
