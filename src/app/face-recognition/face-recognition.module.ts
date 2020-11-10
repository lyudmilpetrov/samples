import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FaceRecognitionRoutes } from './face-recognition.routes';
import { FaceRecognitionComponent } from './face-recognition.component';
import { MaterialModule } from '@app/shared/material.module';
import { OfflineService } from '../services/services';
import { OverlayMessageComponent } from '@app/components/overlay-message/overlay-message.component';
@NgModule({
    imports: [
        RouterModule.forChild(FaceRecognitionRoutes),
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        MaterialModule
    ],
    declarations: [
        FaceRecognitionComponent, OverlayMessageComponent
    ],
    providers: [OfflineService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class FaceRecognitionModule { }
