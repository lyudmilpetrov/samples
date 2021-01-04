import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WebGLRoutes } from './web-gl.routes';
import { WebGLComponent } from './web-gl.component';
import { MaterialModule } from '@app/shared/material.module';
import { OfflineService } from '../services/services';

@NgModule({
    imports: [
        RouterModule.forChild(WebGLRoutes),
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        MaterialModule
    ],
    declarations: [
        WebGLComponent
    ],
    providers: [OfflineService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class WebGLModule { }
