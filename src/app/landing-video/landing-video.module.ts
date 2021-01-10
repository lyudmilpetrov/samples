import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LandingVideoRoutes } from './landing-video.routes';
import { LandingVideoComponent } from './landing-video.component';
import { MaterialModule } from '@app/shared/material.module';
import { OfflineService } from '../services/services';
import { FileUploadModule } from '../components/file-upload/file-upload.module';
import { OverlayMessageModule } from '../components/overlay-message/overlay-message.module';
import { LoginFormModule } from '../components/login-form/login-form.module';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
  imports: [
    RouterModule.forChild(LandingVideoRoutes),
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MaterialModule,
    FileUploadModule,
    OverlayMessageModule,
    LoginFormModule,
    FlexLayoutModule
  ],
  declarations: [
    LandingVideoComponent
  ],
  providers: [OfflineService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class LandingVideoModule { }
